import math
from typing import Dict


def clamp_score(score: int) -> int:
    return max(-2000, min(2000, score))


def calculate_win_percentage(rating: int, centipawns: float) -> float:
    coefficient = rating * -0.00000274 + 0.00048
    exponent = coefficient * centipawns
    return 100 * (0.5 + (0.5 * (2 / (1 + math.exp(exponent)) - 1)))


def adjust_rating(rating: int, game_type: str) -> int:
    adjustments: Dict[str, int] = {"bullet": 0, "blitz": 200, "rapid": 700, "classical": 1200}
    rating += adjustments.get(game_type, 0)
    return max(1000, min(4100, rating))


def parse_time_control(time_control: str) -> int:
    phases = time_control.split(':')
    total_time = 0
    average_moves = 40
    increments = []

    for phase in phases:
        if '+' in phase:
            _, increment = phase.split('+')
            increments.append(int(increment))
        else:
            increments.append(0)

    for index, phase in enumerate(phases):
        if '/' in phase:
            moves, base_increment = phase.split('/')
            base_time = int(base_increment.split('+')[0])
            moves = int(moves)
            total_time += base_time + (moves * increments[index])
        else:
            base_time = int(phase.split('+')[0])
            if index == len(phases) - 1:
                total_time += base_time + (average_moves * increments[index])
            else:
                total_time += base_time

    return total_time


def determine_game_type(time_control: str) -> str:
    if time_control == '-':
        return "unknown"

    total_time = parse_time_control(time_control)

    if total_time < 180:
        return "bullet"
    if total_time < 600:
        return "blitz"
    if total_time < 3600:
        return "rapid"
    return "classical"


__all__ = [
    "adjust_rating",
    "calculate_win_percentage",
    "clamp_score",
    "determine_game_type",
    "parse_time_control",
]
