from __future__ import annotations

import math
from typing import TYPE_CHECKING

from oracle.application.predict_next_moves import PredictNextMoves
from oracle.domain import OracleConfig

if TYPE_CHECKING:
    import chess

PGN_SNIPPET = """
[Event "?"]
[Site "?"]
[Round "?"]
[White "Tester"]
[Black "Tester"]
[WhiteElo "1500"]
[BlackElo "1400"]
[TimeControl "600+5"]

1. e4
""".strip()


class StubSequenceProvider:
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
        assert "e5" in legal_moves and "c5" in legal_moves
        metrics.input_tokens += 2
        metrics.output_tokens += 1
        metrics.cost += 0.01
        return [("e5", math.log(0.6)), ("c5", math.log(0.3))]


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
        return [("e5", 120.0), ("c5", 40.0)]


def test_use_case_combines_sequence_and_engine_results() -> None:
    use_case = PredictNextMoves(
        sequence_provider=StubSequenceProvider(),
        move_analyzer=StubMoveAnalyzer(),
        config=OracleConfig(stockfish_path="/fake/stockfish", depth=2, analysis_depth=1),
    )

    result = use_case.execute(PGN_SNIPPET)

    assert len(result.moves) == 2
    best_moves = [move for move in result.moves if move.is_best_move]
    assert len(best_moves) == 1
    assert best_moves[0].move == "c5"
    total_likelihood = sum(move.likelihood for move in result.moves)
    assert math.isclose(total_likelihood, 100.0, rel_tol=1e-3)
    recomputed_eval = sum(
        move.win_percentage * move.likelihood / 100 for move in result.moves
    )
    assert math.isclose(result.current_win_percentage, recomputed_eval, rel_tol=1e-6)
    assert result.metrics.input_tokens == 2
    assert result.metrics.output_tokens == 1
    assert math.isclose(result.metrics.cost, 0.01, rel_tol=1e-9)
