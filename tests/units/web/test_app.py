from __future__ import annotations

import asyncio
import math
from types import SimpleNamespace

import chess
from fastapi import status
from httpx import ASGITransport, AsyncClient

from oracle.service.prediction import OracleConfig
from oracle.web.app import app, get_oracle_config

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


class DummyOpenAIClient:
    def __init__(self) -> None:
        self.tokens = {"e4": math.log(0.6), "d4": math.log(0.4)}

    def completions_create(self, *_args, **_kwargs) -> SimpleNamespace:
        usage = SimpleNamespace(prompt_tokens=10, completion_tokens=5)
        logprobs = SimpleNamespace(top_logprobs=[self.tokens])
        choice = SimpleNamespace(logprobs=logprobs)
        return SimpleNamespace(choices=[choice], usage=usage)

    def __getattr__(self, item: str):  # pragma: no cover - compatibility shim
        if item == "completions":
            return SimpleNamespace(create=self.completions_create)
        raise AttributeError(item)


class DummyEngine:
    def configure(self, *_args, **_kwargs) -> None:  # pragma: no cover - no-op
        return None

    def analyse(self, board: chess.Board, _limit, multipv: int):
        moves = ["e2e4", "d2d4"][:multipv]
        results = []
        for move in moves:
            pv_move = chess.Move.from_uci(move)
            score = chess.engine.PovScore(chess.engine.Cp(50 if move == "e2e4" else 20), board.turn)
            results.append({"pv": [pv_move], "score": score})
        return results

    def quit(self) -> None:  # pragma: no cover - no-op
        return None


def test_analyze_endpoint_returns_predictions():
    client = DummyOpenAIClient()

    def override_config() -> OracleConfig:
        return OracleConfig(
            stockfish_path="/fake/stockfish",
            openai_api_key="test",
            openai_client=client,
            engine_factory=lambda _path: DummyEngine(),
            depth=1,
        )

    app.dependency_overrides[get_oracle_config] = override_config

    transport = ASGITransport(app=app)

    async def perform_request() -> str:
        async with AsyncClient(transport=transport, base_url="http://testserver") as async_client:
            response = await async_client.post("/analyze", data={"pgn": SAMPLE_PGN})
            return response

    response = asyncio.run(perform_request())

    app.dependency_overrides.clear()

    assert response.status_code == status.HTTP_200_OK
    assert "Predicted Moves" in response.text
    assert "e4" in response.text
