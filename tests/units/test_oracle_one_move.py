import logging
import math
from collections import deque
from typing import Any

import chess

import oracle_one_move as cli
from oracle.domain import OracleConfig
from oracle.service.prediction import build_predict_next_moves_use_case


class StubSequenceProvider:
    def __init__(self) -> None:
        self.calls: list[tuple[str, tuple[str, ...], int]] = []

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
    ) -> list[tuple[str, float]]:
        self.calls.append((prompt, tuple(legal_moves), depth))
        selected_moves = legal_moves[:2]
        log_probs = [math.log(0.65), math.log(0.35)]
        return [
            (move, log_probs[index])
            for index, move in enumerate(selected_moves)
        ]


class StubMoveAnalyzer:
    def __init__(self) -> None:
        self.calls: list[tuple[str, int]] = []

    def analyze(
        self,
        board: chess.Board,
        num_moves: int,
        time_limit: float,
        depth: int,
        threads: int,
        hash_size: int,
    ) -> list[tuple[str, float | str]]:
        self.calls.append((board.board_fen(), num_moves))
        evaluations: list[tuple[str, float]] = []
        for index, move in enumerate(list(board.legal_moves)[:num_moves]):
            san_move = board.san(move)
            score = 60 - index * 5 if board.turn == chess.WHITE else -60 + index * 5
            evaluations.append((san_move, score))
        return evaluations


class CapturingUseCase:
    def __init__(self, inner) -> None:
        self._inner = inner
        self.last_pgn: str | None = None
        self.last_result = None

    @property
    def config(self) -> Any:
        return self._inner.config

    def execute(self, pgn: str):
        self.last_pgn = pgn
        result = self._inner.execute(pgn)
        self.last_result = result
        return result


def test_cli_main_uses_factory_with_simulated_adapters(monkeypatch, caplog):
    real_factory = build_predict_next_moves_use_case
    captured: dict[str, Any] = {}

    def fake_factory(
        config: OracleConfig,
        *,
        stockfish_path: str,
        huggingface_model: str | None = None,
        huggingface_token: str | None = None,
        **_kwargs,
    ):
        captured["config"] = config
        captured["stockfish_path"] = stockfish_path
        captured["huggingface_model"] = huggingface_model
        captured["huggingface_token"] = huggingface_token
        service = real_factory(
            config,
            stockfish_path=stockfish_path,
            huggingface_model=huggingface_model,
            huggingface_token=huggingface_token,
            sequence_provider=StubSequenceProvider(),
            move_analyzer=StubMoveAnalyzer(),
        )
        wrapper = CapturingUseCase(service)
        captured["service"] = wrapper
        return wrapper

    monkeypatch.setattr(cli, "build_predict_next_moves_use_case", fake_factory)
    monkeypatch.delenv("HUGGINGFACEHUB_API_TOKEN", raising=False)
    monkeypatch.delenv("HUGGINGFACE_MODEL_ID", raising=False)
    monkeypatch.delenv("STOCKFISH_PATH", raising=False)

    pgn_lines = [
        "[Event \"?\"]",
        "[Site \"?\"]",
        "[Round \"?\"]",
        "[White \"Tester\"]",
        "[Black \"Tester\"]",
        "[WhiteElo \"1500\"]",
        "[BlackElo \"1600\"]",
        "[TimeControl \"600\"]",
        "",
        "1. e4 e5",
    ]

    responses = deque([
        *pgn_lines,
        "END",
        "cli-token",
        "cli/model",
        "/fake/stockfish",
        "q",
    ])

    monkeypatch.setattr("builtins.input", lambda _prompt="": responses.popleft())

    caplog.set_level(logging.DEBUG)

    cli.main()

    wrapper = captured["service"]
    expected_pgn = "\n".join(pgn_lines)
    assert wrapper.last_pgn == expected_pgn

    config = captured["config"]
    assert config.default_white_elo == 2200
    assert config.default_black_elo == 2300
    assert config.default_game_type == "rapid"
    assert captured["stockfish_path"] == "/fake/stockfish"
    assert captured["huggingface_model"] == "cli/model"
    assert captured["huggingface_token"] == "cli-token"

    first_move = wrapper.last_result.moves[0].move
    breakdown = wrapper.last_result.moves[0].win_percentage_by_rating
    assert set(breakdown) == set(config.rating_buckets)
    assert all(0.0 <= value <= 100.0 for value in breakdown.values())
    assert first_move in caplog.text
    assert "Likelihood" in caplog.text
    assert "Elo" in caplog.text
    assert "Évaluation actuelle" in caplog.text
