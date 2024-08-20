import pytest
from conftest import get_list_pgn

from oracle.core.pgn import extract_san_moves_from_pgn


@pytest.mark.parametrize("pgn_content", get_list_pgn())
def test_extract_san_moves_from_pgn(pgn_content: str):
    """Test extract_san_moves_from_pgn function returns good moves."""
    all_moves = extract_san_moves_from_pgn(pgn_content)
    assert all_moves[:3] == ["e4", "e5", "Nf3"], "The first 3 moves should be e4, e5, Nf3"
