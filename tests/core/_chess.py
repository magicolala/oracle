import io

import chess.pgn
import pytest
from chess import Board
from conftest import get_list_pgn

from experiments.core._chess import uci_to_san


@pytest.mark.parametrize("pgn_content", get_list_pgn())
def test_get_legal_moves(pgn_content):
    """Test get_legal_moves function returns good moves."""
    board = Board()

    # chess-python expects a file-like object
    io_pgn_content = io.StringIO(pgn_content)

    # Get first game from pgn (https://python-chess.readthedocs.io/en/latest/pgn.html)
    first_game = chess.pgn.read_game(io_pgn_content)

    # Get uci moves from mainline (can have variations)
    main_moves = first_game.mainline_moves()

    # Transforms uci moves to san moves
    all_moves = [uci_to_san(move, board) for move in main_moves]

    assert all_moves[:3] == ["e4", "e5", "Nf3"], "The first 3 moves should be e4, e5, Nf3"
