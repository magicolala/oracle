"""Domain models for Oracle predictions."""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Callable


@dataclass
class OracleConfig:
    """Configuration required to evaluate and predict chess moves."""

    stockfish_path: str
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
    huggingface_client: Any | None = None
    engine_factory: Callable[[str], Any] | None = None


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


@dataclass
class PredictionResult:
    """Structured predictions returned by the prediction service."""

    moves: list[MovePrediction]
    current_win_percentage: float
    metrics: PredictionMetrics = field(default_factory=PredictionMetrics)


__all__ = [
    "OracleConfig",
    "PredictionMetrics",
    "MovePrediction",
    "PredictionResult",
]
