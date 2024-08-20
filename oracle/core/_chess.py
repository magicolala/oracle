from typing import List

from chess import Board, Move


def get_legal_moves(board: Board) -> List[str]:
    """
    Get legal moves for the current board state

    Args:
        board (Board): Chess board of the current state

    Returns:
        List of legal moves in SAN format
    """
    return [board.san(move) for move in board.legal_moves]


def uci_to_san(move_uci: Move, board: Board) -> str:
    """
    Convert UCI move to SAN move

    Notes:
        board var is a reference to the current state of the board
        the board will be updated with the new move (allow to iterate over moves)

    Args:
        move_uci (str): UCI move
        board (Board): Chess board of the current state

    Returns:
        SAN move
    """
    move_san = board.san(move_uci)
    board.push(move_uci)
    return move_san
