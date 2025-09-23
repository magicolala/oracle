from typing import Tuple

import chess


def compute_best_move_notation(
    best_win_percentage: float,
    normalized_probability: float,
    board_turn: bool,
    current_win_percentage: float,
    thresholds: Tuple[float, float] = (40.0, 80.0),
) -> str:
    low, high = thresholds
    if (
        board_turn == chess.WHITE
        and best_win_percentage > 20
        and best_win_percentage - current_win_percentage > 5
    ) or (
        board_turn == chess.BLACK
        and best_win_percentage < 80
        and current_win_percentage - best_win_percentage > 5
    ):
        if normalized_probability < low:
            return "!!"
        if low <= normalized_probability <= high:
            return "!"
    return ""


__all__ = ["compute_best_move_notation"]
