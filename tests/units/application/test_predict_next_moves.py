from __future__ import annotations

import math

import chess

from oracle.application.predict_next_moves import PredictNextMoves
from oracle.domain import OracleConfig

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
    ):
        legal_moves = list(board.legal_moves)[:num_moves]
        evaluations: list[tuple[str, float]] = []
        base = 120.0 if board.turn == chess.WHITE else -120.0
        step = 40.0
        for index, move in enumerate(legal_moves):
            san_move = board.san(move)
            score = base - step * index if board.turn == chess.WHITE else base + step * index
            evaluations.append((san_move, score))
        return evaluations


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
