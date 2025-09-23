"""Pure domain services and helpers."""
from __future__ import annotations

import math
import re
from typing import Sequence


def clean_pgn(pgn: str) -> str:
    """Normalise a PGN snippet into a single-line moves string."""

    lines = pgn.strip().split("\n")
    cleaned_lines: list[str] = []
    headers: list[str] = []
    moves: list[str] = []
    header_present = False
    moves_started = False

    required_headers = [
        "[Event ",
        "[Site ",
        "[Round ",
        "[White ",
        "[Black ",
        "[WhiteElo ",
        "[BlackElo ",
        "[TimeControl ",
    ]
    for line in lines:
        if line.startswith("["):
            if any(line.startswith(header) for header in required_headers):
                headers.append(line.strip())
                header_present = True
        else:
            if line.strip():
                moves_started = True
            if moves_started:
                moves.append(line.strip())

    if not header_present:
        default_header = ['[White "?"]', '[Black "?"]', '[WhiteElo "?"]', '[BlackElo "?"]']
        headers = default_header

    moves_str = " ".join(moves)

    if moves_str.endswith(("1-0", "0-1", "1/2-1/2", "*")):
        moves_str = moves_str.rsplit(" ", 1)[0]

    moves_str = re.sub(r"\s?\{[^}]*\}", "", moves_str)
    moves_str = re.sub(r"\s?\$\d{1,2}", "", moves_str)
    moves_str = re.sub(r"\s?\d+\.\.\.", "", moves_str)
    moves_str = re.sub(r"[?!]", "", moves_str)

    while re.search(r"\([^()]*\)", moves_str):
        moves_str = re.sub(r"\([^()]*\)", "", moves_str)

    moves_str = re.sub(r"\s+", " ", moves_str).strip()
    if moves_str and moves_str[-1] != ".":
        last_space_index = moves_str.rfind(" ")

        if last_space_index > 0 and moves_str[last_space_index - 1] == ".":
            pass
        else:
            last_dot_index = moves_str.rfind(".")

            move_number_start = moves_str.rfind(" ", 0, last_dot_index) + 1
            move_number = int(moves_str[move_number_start:last_dot_index]) + 1
            moves_str += f" {move_number}."

    moves = moves_str.split(" ") if moves_str else []

    cleaned_lines = [*headers, "", " ".join(moves)]

    result = "\n".join(cleaned_lines)
    return result


def parse_time_control(time_control: str) -> int:
    phases = time_control.split(":")
    total_time = 0
    average_moves = 40
    increments: list[int] = []

    for phase in phases:
        if "+" in phase:
            _, increment = phase.split("+")
            increments.append(int(increment))
        else:
            increments.append(0)

    for i, phase in enumerate(phases):
        if "/" in phase:
            moves, base_increment = phase.split("/")
            base_time = int(base_increment.split("+")[0])
            moves = int(moves)
            total_time += base_time + (moves * increments[i])
        else:
            base_time = int(phase.split("+")[0])
            if i == len(phases) - 1:
                total_time += base_time + (average_moves * increments[i])
            else:
                total_time += base_time

    return total_time


def determine_game_type(time_control: str) -> str:
    if time_control == "-":
        return "Unknown"

    total_time = parse_time_control(time_control)

    if total_time < 180:
        return "bullet"
    if total_time < 600:
        return "blitz"
    if total_time < 3600:
        return "rapid"
    return "classical"


def adjust_rating(rating: int, game_type: str) -> int:
    adjustments = {"bullet": 0, "blitz": 200, "rapid": 700, "classical": 1200}
    rating += adjustments.get(game_type, 0)
    rating = max(1000, min(4100, rating))
    return rating


def calculate_win_percentage(rating: int, centipawns: float) -> float:
    coefficient = rating * -0.00000274 + 0.00048
    exponent = coefficient * centipawns
    win_percentage = 100 * (0.5 + (0.5 * (2 / (1 + math.exp(exponent)) - 1)))
    return win_percentage


def get_best_move_notation(
    best_win_percentage: float,
    new_norm_prob: float,
    is_white_turn: bool,
    current_win_percentage: float,
) -> str:
    if (
        is_white_turn
        and best_win_percentage > 20
        and best_win_percentage - current_win_percentage > 5
    ) or (
        not is_white_turn
        and best_win_percentage < 80
        and current_win_percentage - best_win_percentage > 5
    ):
        if new_norm_prob < 40:
            return "!!"
        if 40 <= new_norm_prob <= 80:
            return "!"
    return ""


def get_color_and_notation(
    percentage_loss: float,
    is_best_move: bool,
    best_move_notation: str,
) -> tuple[str, str]:
    if is_best_move:
        return "\033[96m", best_move_notation

    if percentage_loss == 0:
        if best_move_notation in ["!!", "!"]:
            return "\033[96m", "!!" if best_move_notation == "!!" else "!"
        return "\033[96m", ""

    if 0 < percentage_loss <= 0.5:
        if best_move_notation in ["!!", "!"]:
            return "\033[92m", "!!" if best_move_notation == "!!" else "!"
        return "\033[92m", ""
    if 0.5 < percentage_loss <= 2.5:
        if best_move_notation == "!!":
            return "\033[92m", "!"
        return "\033[92m", ""
    if 2.5 < percentage_loss <= 5:
        return "\033[93m", "?!"
    if 5 < percentage_loss <= 10:
        return "\033[93m", "?!"
    if 10 < percentage_loss <= 20:
        return "\033[33m", "?"
    return "\033[91m", "??"


def highlight_move(move: str, color: str) -> str:
    color_end = "\033[0m"
    return f"{color}{move}{color_end}"


def find_best_move_index(
    moves: Sequence[tuple[str, float]],
    is_white_turn: bool,
) -> tuple[int, float]:
    best_eval = max if is_white_turn else min
    best_move = best_eval(moves, key=lambda x: x[1])
    best_move_idx = moves.index(best_move)
    return best_move_idx, best_move[1]


__all__ = [
    "adjust_rating",
    "calculate_win_percentage",
    "clean_pgn",
    "determine_game_type",
    "find_best_move_index",
    "get_best_move_notation",
    "get_color_and_notation",
    "highlight_move",
    "parse_time_control",
]
