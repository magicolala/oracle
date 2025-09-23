from typing import Tuple


def highlight_move(move: str, color: str) -> str:
    return f"{color}{move}\033[0m"


def get_color_and_notation(percentage_loss: float, is_best_move: bool, best_move_notation: str) -> Tuple[str, str]:
    if is_best_move:
        return "\033[96m", best_move_notation

    if percentage_loss == 0:
        if best_move_notation in ("!!", "!"):
            return "\033[96m", "!!" if best_move_notation == "!!" else "!"
        return "\033[96m", ""

    if 0 < percentage_loss <= 0.5:
        if best_move_notation in ("!!", "!"):
            return "\033[92m", "!!" if best_move_notation == "!!" else "!"
        return "\033[92m", ""
    if 0.5 < percentage_loss <= 2.5:
        if best_move_notation == "!!":
            return "\033[92m", "!"
        return "\033[92m", ""
    if 2.5 < percentage_loss <= 5:
        return "\033[92m", ""
    if 5 < percentage_loss <= 10:
        return "\033[93m", "?!"
    if 10 < percentage_loss <= 20:
        return "\033[33m", "?"
    return "\033[91m", "??"


__all__ = ["get_color_and_notation", "highlight_move"]
