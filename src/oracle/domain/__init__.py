"""Domain models for Oracle predictions."""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Callable


@dataclass
class OracleConfig:
    """Configuration required to evaluate and predict chess moves."""

    stockfish_path: str = ""
    huggingface_model: str = "mistralai/Mistral-7B-Instruct-v0.2"
    huggingface_token: str | None = None
    huggingface_token_env_var: str | None = "HUGGINGFACEHUB_API_TOKEN"
    temperature: float | None = 0.7
    top_p: float | None = None
    top_k: int | None = None
    repetition_penalty: float | None = None
    depth: int = 5
    prob_threshold: float = 0.001
    analysis_time_limit: float = 1.3
    analysis_depth: int = 20
    analysis_threads: int = 8
    analysis_hash_size: int = 512
    default_white_elo: int = 1500
    default_black_elo: int = 1500
    default_game_type: str = "classical"
    rating_buckets: list[int] = field(
        default_factory=lambda: [1200, 1500, 1800, 2100]
    )
    level_time_controls: dict[int, str] = field(
        default_factory=lambda: {
            800: "120+0",
            1200: "300+2",
            1600: "900+10",
            2000: "3600+30",
        }
    )
    play_mode_time_control: str = "600+0"
    huggingface_client: Any | None = None
    engine_factory: Callable[[str], Any] | None = None

    @property
    def available_levels(self) -> tuple[int, ...]:
        """Expose the configured player levels sorted increasingly."""

        return tuple(sorted(self.level_time_controls))

    def time_control_for_level(
        self, level: int, mode: str | None = None
    ) -> str | None:
        """Return the time control associated with a level, accounting for the mode."""

        if mode == "play":
            return self.play_mode_time_control
        return self.level_time_controls.get(level)

    def time_control_for_mode(self, mode: str) -> str | None:
        """Expose the default time control for a specific interaction mode."""

        if mode == "play":
            return self.play_mode_time_control
        return None


@dataclass
class PredictionMetrics:
    """Book-keeping for language model usage statistics."""

    input_tokens: int = 0
    output_tokens: int = 0
    cost: float = 0.0


@dataclass
class MovePrediction:
    """Final prediction for a single chess move."""

    move: str
    likelihood: float
    win_percentage: float
    notation: str
    is_best_move: bool
    principal_variation: list[str] | None = None
    win_percentage_by_rating: dict[int, float] = field(default_factory=dict)


@dataclass
class PredictionSnapshot:
    """Snapshot of the prediction for a truncated PGN sequence."""

    ply: int
    pgn: str
    moves: list[MovePrediction]
    current_win_percentage: float
    is_white_to_move: bool

    @property
    def san(self) -> str:
        """Return the SAN sequence associated with the snapshot."""

        lines = [line for line in self.pgn.splitlines() if line.strip()]
        return lines[-1] if lines else ""


@dataclass
class PredictionResult:
    """Structured predictions returned by the prediction service."""

    history: list[PredictionSnapshot] = field(default_factory=list)
    metrics: PredictionMetrics = field(default_factory=PredictionMetrics)

    @property
    def moves(self) -> list[MovePrediction]:
        """Expose the moves from the most recent snapshot for compatibility."""

        return self.history[-1].moves if self.history else []

    @property
    def current_win_percentage(self) -> float:
        """Expose the evaluation from the most recent snapshot for compatibility."""

        return self.history[-1].current_win_percentage if self.history else 0.0

    def last(self) -> PredictionSnapshot | None:
        """Return the latest prediction snapshot when available."""

        return self.history[-1] if self.history else None


__all__ = [
    "MovePrediction",
    "OracleConfig",
    "PredictionMetrics",
    "PredictionResult",
    "PredictionSnapshot",
]
