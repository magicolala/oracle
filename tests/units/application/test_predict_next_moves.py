from __future__ import annotations

import math

import chess
import pytest

from oracle.application.predict_next_moves import PredictNextMoves
from oracle.domain import OracleConfig
from oracle.domain.services import adjust_rating, determine_game_type

PGN_SNIPPET = """
[Event "?"]
[Site "?"]
[Round "?"]
[White "Tester"]
[Black "Tester"]
[WhiteElo "1500"]
[BlackElo "1400"]
[TimeControl "600+5"]

1. e4 e5 2. Nf3 Nc6
""".strip()


class StubSequenceProvider:
    def __init__(self) -> None:
        self.prompts: list[str] = []

    def get_top_sequences(
        self,
        prompt: str,
        legal_moves: list[str],
        depth: int,
        metrics,
        prob_threshold: float,
        temperature: float | None = None,
        top_p: float | None = None,
        top_k: int | None = None,
        repetition_penalty: float | None = None,
        retries: int = 3,
    ):
        self.prompts.append(prompt)
        metrics.input_tokens += 1
        metrics.output_tokens += 1
        metrics.cost += 0.01
        selected_moves = legal_moves[:2]
        probabilities = [0.6, 0.3]
        results: list[tuple[str, float]] = []
        for index, move in enumerate(selected_moves):
            weight = probabilities[index] if index < len(probabilities) else 0.1
            results.append((move, math.log(weight)))
        return results


class StubMoveAnalyzer:
    def analyze(
        self,
        board: chess.Board,
        num_moves: int,
        time_limit: float,
        depth: int,
        threads: int,
        hash_size: int,
    ) -> list[tuple[str, float | str, list[str]]]:
        legal_moves = list(board.legal_moves)[:num_moves]
        evaluations: list[tuple[str, float, list[str]]] = []
        base = 120.0 if board.turn == chess.WHITE else -120.0
        step = 40.0
        for index, move in enumerate(legal_moves):
            san_move = board.san(move)
            score = base - step * index if board.turn == chess.WHITE else base + step * index
            evaluations.append((san_move, score, [san_move]))
        return evaluations


class RecordingPredictNextMoves(PredictNextMoves):
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)
        self.observed_contexts: list[tuple[int, int, int, str]] = []

    def _evaluate_position(
        self,
        board: chess.Board,
        prompt: str,
        metrics,
        white_rating: int,
        black_rating: int,
        high_rating: int,
        game_type: str,
    ):
        self.observed_contexts.append((white_rating, black_rating, high_rating, game_type))
        return super()._evaluate_position(
            board,
            prompt,
            metrics,
            white_rating,
            black_rating,
            high_rating,
            game_type,
        )


def test_use_case_combines_sequence_and_engine_results() -> None:
    use_case = PredictNextMoves(
        sequence_provider=StubSequenceProvider(),
        move_analyzer=StubMoveAnalyzer(),
        config=OracleConfig(
            stockfish_path="/fake/stockfish",
            depth=2,
            analysis_depth=1,
            rating_buckets=[1200, 1500, 2000],
        ),
    )

    result = use_case.execute(PGN_SNIPPET)

    assert len(result.history) == 5
    assert result.history[-1].moves == result.moves
    assert result.history[0].san == "1."
    assert result.history[1].san == "1. e4"
    assert result.history[-1].san.endswith("3.")

    final_snapshot = result.history[-1]
    assert len(final_snapshot.moves) >= 1
    best_moves = [move for move in final_snapshot.moves if move.is_best_move]
    assert len(best_moves) == 1
    total_likelihood = sum(move.likelihood for move in final_snapshot.moves)
    assert math.isclose(total_likelihood, 100.0, rel_tol=1e-3)
    recomputed_eval = sum(
        move.win_percentage * move.likelihood / 100 for move in final_snapshot.moves
    )
    assert math.isclose(final_snapshot.current_win_percentage, recomputed_eval, rel_tol=1e-6)
    assert math.isclose(result.current_win_percentage, final_snapshot.current_win_percentage, rel_tol=1e-6)

    for move in final_snapshot.moves:
        assert set(move.win_percentage_by_rating) == {1200, 1500, 2000}
        for value in move.win_percentage_by_rating.values():
            assert 0.0 <= value <= 100.0

    assert result.metrics.input_tokens == len(result.history)
    assert result.metrics.output_tokens == len(result.history)
    assert math.isclose(result.metrics.cost, 0.01 * len(result.history), rel_tol=1e-9)


def test_execute_applies_selected_level_overrides_pgn_metadata() -> None:
    level_config = {
        800: "120+0",
        1200: "300+2",
    }
    use_case = RecordingPredictNextMoves(
        sequence_provider=StubSequenceProvider(),
        move_analyzer=StubMoveAnalyzer(),
        config=OracleConfig(
            stockfish_path="/fake/stockfish",
            depth=2,
            analysis_depth=1,
            rating_buckets=[800, 1200, 1600],
            level_time_controls=level_config,
        ),
    )

    result = use_case.execute(PGN_SNIPPET, selected_level=800)

    assert result.history
    expected_game_type = determine_game_type(level_config[800])
    assert expected_game_type == "bullet"
    adjusted_rating = adjust_rating(800, expected_game_type)
    assert use_case.observed_contexts
    for white_rating, black_rating, high_rating, game_type in use_case.observed_contexts:
        assert white_rating == adjusted_rating
        assert black_rating == adjusted_rating
        assert high_rating == adjusted_rating
        assert game_type == expected_game_type


def test_execute_in_play_mode_uses_ten_minute_time_control() -> None:
    use_case = RecordingPredictNextMoves(
        sequence_provider=StubSequenceProvider(),
        move_analyzer=StubMoveAnalyzer(),
        config=OracleConfig(
            stockfish_path="/fake/stockfish",
            depth=2,
            analysis_depth=1,
            rating_buckets=[800, 1200, 1600],
        ),
    )

    result = use_case.execute(PGN_SNIPPET, selected_level=800, mode="play")

    assert result.history
    expected_game_type = determine_game_type(use_case.config.play_mode_time_control)
    adjusted_rating = adjust_rating(800, expected_game_type)
    assert use_case.observed_contexts
    for white_rating, black_rating, high_rating, game_type in use_case.observed_contexts:
        assert white_rating == adjusted_rating
        assert black_rating == adjusted_rating
        assert high_rating == adjusted_rating
        assert game_type == expected_game_type


def test_execute_raises_for_unknown_level() -> None:
    use_case = PredictNextMoves(
        sequence_provider=StubSequenceProvider(),
        move_analyzer=StubMoveAnalyzer(),
        config=OracleConfig(level_time_controls={800: "120+0"}),
    )

    with pytest.raises(ValueError):
        use_case.execute(PGN_SNIPPET, selected_level=999)
