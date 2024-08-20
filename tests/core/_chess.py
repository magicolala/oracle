import chess
import pytest
from conftest import get_list_pgn

from oracle.core._chess import get_legal_moves


@pytest.mark.parametrize("pgn_content", get_list_pgn())
def test_get_legal_moves(pgn_content: str):
    """Test get_legal_moves function returns good moves."""
    board = chess.Board()
    legal_moves = get_legal_moves(board)
    assert legal_moves[:3] == ["Nh3", "Nf3", "Nc3"], "The first 3 moves should be Nh3, Nf3, Nc3"
