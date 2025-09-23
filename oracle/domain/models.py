from dataclasses import dataclass, field
from typing import List, Optional


@dataclass
class TokenUsage:
    input_tokens: int = 0
    output_tokens: int = 0
    cost_usd: float = 0.0


@dataclass
class MovePrediction:
    move: str
    raw_probability: float
    normalized_probability: float
    win_percentage: float
    percentage_loss: float
    centipawn_eval: Optional[float] = None
    eval_with_mate: Optional[str] = None
    is_best: bool = False
    notation: str = ""
    color_code: str = "\033[0m"


@dataclass
class PredictionReport:
    rows: List[MovePrediction] = field(default_factory=list)
    current_win_percentage: float = 0.0
    best_move_importance: float = 0.0
    elapsed_seconds: float = 0.0
    usage: TokenUsage = field(default_factory=TokenUsage)


@dataclass
class GameContext:
    pgn: str
    white_elo: int
    black_elo: int
    game_type: str


@dataclass
class BatchPredictionRow:
    game_index: int
    move_number: int
    side_to_move: str
    prediction: str
    notation: str
    raw_probability: float
    normalized_probability: float
    win_percentage: float
    eval_centipawns: Optional[float]
    eval_with_mate: Optional[str]
    is_played: bool
    best_move_importance: float
    rating: int
    game_type: str


@dataclass
class BatchPredictionSummary:
    rows: List[BatchPredictionRow] = field(default_factory=list)
    total_moves: int = 0
    elapsed_seconds: float = 0.0
    usage: TokenUsage = field(default_factory=TokenUsage)

