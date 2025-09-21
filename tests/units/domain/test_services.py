from __future__ import annotations

import pytest

from oracle.domain.services import (
    adjust_rating,
    calculate_win_percentage,
    clean_pgn,
    determine_game_type,
    find_best_move_index,
    get_best_move_notation,
    get_color_and_notation,
)


def test_clean_pgn_strips_metadata_and_annotations():
    raw_pgn = """
    [Event "?"]
    [White "Tester"]
    {This is a comment}

    1. e4 e5 2. Nf3 Nc6 2... a6 $1 3. Bb5?! a6 1-0
    """
    cleaned = clean_pgn(raw_pgn)
    assert "{" not in cleaned
    assert "$" not in cleaned
    assert "?!" not in cleaned
    assert cleaned.splitlines()[-1].endswith("4.")


@pytest.mark.parametrize(
    "time_control,expected",
    [
        ("60+0", "bullet"),
        ("300+0", "blitz"),
        ("900+0", "rapid"),
        ("3600+0", "classical"),
    ],
)
def test_determine_game_type(time_control: str, expected: str) -> None:
    assert determine_game_type(time_control) == expected


def test_adjust_rating_respects_bounds() -> None:
    assert adjust_rating(800, "classical") == 2000
    assert adjust_rating(4200, "blitz") == 4100


def test_calculate_win_percentage_increases_with_score() -> None:
    neutral = calculate_win_percentage(2000, 0)
    winning = calculate_win_percentage(2000, 200)
    losing = calculate_win_percentage(2000, -200)
    assert losing < neutral < winning


def test_find_best_move_index_uses_turn() -> None:
    moves = [("e4", 0.5), ("d4", 0.8)]
    idx_white, value_white = find_best_move_index(moves, True)
    idx_black, value_black = find_best_move_index(moves, False)
    assert (idx_white, value_white) == (1, 0.8)
    assert (idx_black, value_black) == (0, 0.5)


def test_get_best_move_notation_and_color_adjustments() -> None:
    notation = get_best_move_notation(60, 30, True, 40)
    assert notation == "!!"
    color, symbol = get_color_and_notation(0.3, False, notation)
    assert color == "\033[92m"
    assert symbol == "!!"
