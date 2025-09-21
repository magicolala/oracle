from __future__ import annotations

import asyncio
import math
from typing import Any

import chess
from fastapi import status
from httpx import ASGITransport, AsyncClient

from oracle.domain import OracleConfig
from oracle.service.prediction import build_predict_next_moves_use_case
from oracle.web.app import app

SAMPLE_PGN = """
[Event "?"]
[Site "?"]
[Round "?"]
[White "Tester"]
[Black "Tester"]
[WhiteElo "1500"]
[BlackElo "1600"]
[TimeControl "600"]

1.
""".strip()

LEVEL_TIME_CONTROLS = {800: "120+0", 1200: "300+2", 1600: "900+10"}


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
        probabilities = [math.log(0.7), math.log(0.3)]
        return [
            (move, probabilities[idx])
            for idx, move in enumerate(selected_moves)
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
        legal_moves = list(board.legal_moves)[:num_moves]
        for index, move in enumerate(legal_moves):
            san_move = board.san(move)
            score = 80 - index * 10 if board.turn == chess.WHITE else -80 + index * 10
            evaluations.append((san_move, score))
        return evaluations


class CapturingUseCase:
    def __init__(self, inner) -> None:
        self._inner = inner
        self.last_pgn: str | None = None
        self.last_result = None
        self.last_selected_level: int | None = None

    @property
    def config(self) -> Any:
        return self._inner.config

    def execute(self, pgn: str, selected_level: int | None = None):
        self.last_pgn = pgn
        self.last_selected_level = selected_level
        result = self._inner.execute(pgn, selected_level=selected_level)
        self.last_result = result
        return result


def configure_test_environment(monkeypatch) -> dict[str, Any]:
    real_factory = build_predict_next_moves_use_case
    captured: dict[str, Any] = {}

    def fake_factory(
        config,
        *,
        stockfish_path: str,
        huggingface_model: str | None = None,
        huggingface_token: str | None = None,
        **_kwargs,
    ):
        captured["stockfish_path"] = stockfish_path
        captured["huggingface_model"] = huggingface_model
        captured["huggingface_token"] = huggingface_token
        captured["config"] = config
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

    def fake_get_config() -> OracleConfig:
        return OracleConfig(level_time_controls=LEVEL_TIME_CONTROLS.copy())

    monkeypatch.setattr("oracle.web.app.build_predict_next_moves_use_case", fake_factory)
    monkeypatch.setattr("oracle.web.app.get_oracle_config", fake_get_config)

    return captured


def test_analyze_endpoint_returns_predictions(monkeypatch):
    captured = configure_test_environment(monkeypatch)
    monkeypatch.setenv("STOCKFISH_PATH", "/fake/stockfish")
    monkeypatch.setenv("HUGGINGFACE_MODEL_ID", "test/model")
    monkeypatch.setenv("HUGGINGFACEHUB_API_TOKEN", "api-token")

    transport = ASGITransport(app=app)

    async def perform_request():
        async with AsyncClient(transport=transport, base_url="http://testserver") as async_client:
            return await async_client.post("/analyze", data={"pgn": SAMPLE_PGN})

    response = asyncio.run(perform_request())

    assert response.status_code == status.HTTP_200_OK
    wrapper = captured["service"]
    assert wrapper.last_pgn == SAMPLE_PGN
    assert captured["stockfish_path"] == "/fake/stockfish"
    assert captured["huggingface_model"] == "test/model"
    assert captured["huggingface_token"] == "api-token"
    assert "Explorer les coups" in response.text
    first_move = wrapper.last_result.moves[0].move
    assert first_move in response.text
    assert "Évaluations Elo" in response.text
    assert wrapper.last_selected_level is None


def test_analyze_endpoint_forwards_selected_level(monkeypatch):
    captured = configure_test_environment(monkeypatch)
    monkeypatch.setenv("STOCKFISH_PATH", "/fake/stockfish")
    monkeypatch.setenv("HUGGINGFACE_MODEL_ID", "test/model")
    monkeypatch.setenv("HUGGINGFACEHUB_API_TOKEN", "api-token")

    transport = ASGITransport(app=app)

    async def perform_request():
        async with AsyncClient(transport=transport, base_url="http://testserver") as async_client:
            return await async_client.post(
                "/analyze", data={"pgn": SAMPLE_PGN, "level": "1200"}
            )

    response = asyncio.run(perform_request())

    assert response.status_code == status.HTTP_200_OK
    wrapper = captured["service"]
    assert wrapper.last_pgn == SAMPLE_PGN
    assert wrapper.last_selected_level == 1200
    config: OracleConfig = captured["config"]
    assert config.time_control_for_level(1200) == LEVEL_TIME_CONTROLS[1200]


def test_analyze_endpoint_rejects_non_numeric_level(monkeypatch):
    configure_test_environment(monkeypatch)
    monkeypatch.setenv("STOCKFISH_PATH", "/fake/stockfish")
    monkeypatch.setenv("HUGGINGFACE_MODEL_ID", "test/model")
    monkeypatch.setenv("HUGGINGFACEHUB_API_TOKEN", "api-token")

    transport = ASGITransport(app=app)

    async def perform_request():
        async with AsyncClient(transport=transport, base_url="http://testserver") as async_client:
            return await async_client.post(
                "/analyze", data={"pgn": SAMPLE_PGN, "level": "niveau"}
            )

    response = asyncio.run(perform_request())

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "Niveau invalide" in response.text


def test_analyze_endpoint_rejects_unknown_level(monkeypatch):
    configure_test_environment(monkeypatch)
    monkeypatch.setenv("STOCKFISH_PATH", "/fake/stockfish")
    monkeypatch.setenv("HUGGINGFACE_MODEL_ID", "test/model")
    monkeypatch.setenv("HUGGINGFACEHUB_API_TOKEN", "api-token")

    transport = ASGITransport(app=app)

    async def perform_request():
        async with AsyncClient(transport=transport, base_url="http://testserver") as async_client:
            return await async_client.post(
                "/analyze", data={"pgn": SAMPLE_PGN, "level": "9999"}
            )

    response = asyncio.run(perform_request())

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "Niveau inconnu" in response.text
