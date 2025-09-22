"""Application ports defining required services."""
from __future__ import annotations

from typing import TYPE_CHECKING, Protocol

if TYPE_CHECKING:
    import chess

    from oracle.domain import PredictionMetrics, PredictionResult


class SequenceProvider(Protocol):
    """Provide probabilistic move continuations from a sequence model."""

    def get_top_sequences(
        self,
        prompt: str,
        legal_moves: list[str],
        depth: int,
        metrics: PredictionMetrics,
        prob_threshold: float,
        temperature: float | None = None,
        top_p: float | None = None,
        top_k: int | None = None,
        repetition_penalty: float | None = None,
    ) -> list[tuple[str, float]]:
        """Return sequences along with their log probabilities."""


class MoveAnalyzer(Protocol):
    """Evaluate moves using a chess engine or equivalent service."""

    def analyze(
        self,
        board: chess.Board,
        num_moves: int,
        time_limit: float,
        depth: int,
        threads: int,
        hash_size: int,
    ) -> list[tuple[str, float | str, list[str]]]:
        """Return tuples of SAN moves, evaluations, and principal variations."""


class PredictNextMovesUseCase(Protocol):
    """Application use case for predicting the next chess moves."""

    def execute(
        self,
        pgn: str,
        selected_elo: int | None = None,
        selected_time_control: str | None = None,
        *,
        mode: str | None = None,
    ) -> PredictionResult:
        """Predict the next moves for the given PGN string."""