import io
from typing import List

import chess.pgn
from chess import Move

from src.oracle.core._chess import uci_to_san


def extract_moves_from_pgn(pgn_content: str) -> List[Move]:
    """
    Extract moves (uci) from a pgn file

    Args:
        pgn_content (str): Path to the pgn file

    Returns:
        List of moves in SAN format
    """
    # chess-python expects a file-like object
    io_pgn_content = io.StringIO(pgn_content)

    # Get first game from pgn (https://python-chess.readthedocs.io/en/latest/pgn.html)
    first_game = chess.pgn.read_game(io_pgn_content)
    if first_game is None:
        return []

    # Get uci moves from mainline (can have variations)
    main_moves = first_game.mainline_moves()

    # Transforms uci moves to san moves
    return list(main_moves)


def extract_san_moves_from_pgn(pgn_content: str) -> List[str]:
    """
    Extract moves (san) from a pgn file

    Args:
        pgn_content (str): Path to the pgn file

    Returns:
        List of moves in SAN format
    """
    board = chess.Board()
    moves = extract_moves_from_pgn(pgn_content)
    return [uci_to_san(move, board) for move in moves]
