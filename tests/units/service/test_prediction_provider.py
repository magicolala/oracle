from __future__ import annotations

import math
from collections import OrderedDict
from typing import Any

from oracle.domain import PredictionMetrics
from oracle.service.prediction import HuggingFaceSequenceProvider


class RecordingClient:
    def __init__(self) -> None:
        self.requests: list[dict[str, Any]] = []
        self._call_index = 0

    def text_generation(self, prompt: str, **kwargs: Any) -> Any:
        self.requests.append(kwargs)
        self._call_index += 1
        if "top_n_tokens" not in kwargs:
            return {"details": {"tokens": [{}]}}

        if self._call_index == 1:
            top_tokens = [
                {"text": " e", "logprob": math.log(0.7)},
                {"text": " d", "logprob": math.log(0.2)},
            ]
        else:
            top_tokens = [
                {"text": " 4", "logprob": math.log(0.6)},
                {"text": " 5", "logprob": math.log(0.3)},
            ]
        return {"details": {"tokens": [{"top_tokens": top_tokens}]}}


def test_provider_requests_top_tokens_and_returns_sequences() -> None:
    client = RecordingClient()
    provider = HuggingFaceSequenceProvider(client)
    metrics = PredictionMetrics()

    sequences = provider.get_top_sequences(
        "[Event \"?\"]",  # prompt content is irrelevant for the stub
        ["e4", "d4"],
        depth=2,
        metrics=metrics,
        prob_threshold=0.05,
        top_k=3,
        top_n_tokens=None,
    )

    requested_candidates = [call.get("top_n_tokens") for call in client.requests]
    assert requested_candidates
    assert all(value == 3 for value in requested_candidates)

    returned_moves = {move for move, _ in sequences}
    assert {"e4", "d4"}.issubset(returned_moves)
    assert all(logprob <= 0 for _, logprob in sequences)
    assert metrics.input_tokens >= 0
    assert metrics.output_tokens >= 0


class DuplicateTokenClient:
    def __init__(self) -> None:
        self.prompts: list[str] = []

    def text_generation(self, prompt: str, **kwargs: Any) -> Any:
        self.prompts.append(prompt)
        return {"prompt": prompt}


def test_provider_deduplicates_sequences_without_mutating_legals(monkeypatch) -> None:
    client = DuplicateTokenClient()
    provider = HuggingFaceSequenceProvider(client)
    metrics = PredictionMetrics()
    legal_moves = ["Qh5"]

    def fake_extract(response: Any) -> OrderedDict[str, float]:
        prompt = response["prompt"]
        if prompt == "[Event \"?\"]":
            return OrderedDict([(" Q", math.log(0.9))])
        if prompt == "[Event \"?\"] Q":
            return OrderedDict(
                [
                    (" h", math.log(0.8)),
                    ("h", math.log(0.7)),
                ]
            )
        return OrderedDict()

    monkeypatch.setattr(
        "oracle.service.prediction._extract_token_logprobs",
        fake_extract,
    )

    sequences = provider.get_top_sequences(
        "[Event \"?\"]",
        legal_moves,
        depth=2,
        metrics=metrics,
        prob_threshold=0.0,
    )

    assert legal_moves == ["Qh5"]
    assert len(sequences) == 1
    assert sequences[0][0] == "Qh5"
    assert all(logprob <= 0 for _, logprob in sequences)
