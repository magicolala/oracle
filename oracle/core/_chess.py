from typing import List

from chess import Board


def get_legal_moves(board: Board) -> List[str]:
    """
    Get legal moves for the current board state

    Args:
        board (Board): Chess board of the current state

    Returns:
        List of legal moves in SAN format
    """
    return [board.san(move) for move in board.legal_moves]
