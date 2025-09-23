import io
import re
from typing import Iterable, List, Tuple

import chess
import chess.pgn

REQUIRED_HEADERS = [
    '[Event ',
    '[Site ',
    '[Round ',
    '[White ',
    '[Black ',
    '[WhiteElo ',
    '[BlackElo ',
    '[TimeControl ',
]


def clean_pgn(pgn: str) -> str:
    lines = pgn.strip().split('\n')
    headers: List[str] = []
    moves: List[str] = []
    header_present = False
    moves_started = False

    for line in lines:
        if line.startswith('['):
            if any(line.startswith(header) for header in REQUIRED_HEADERS):
                headers.append(line.strip())
                header_present = True
        else:
            if line.strip():
                moves_started = True
            if moves_started:
                moves.append(line.strip())

    if not header_present:
        headers = [
            '[White "?"]',
            '[Black "?"]',
            '[WhiteElo "?"]',
            '[BlackElo "?"]',
        ]

    moves_str = ' '.join(moves)

    if moves_str.endswith(('1-0', '0-1', '1/2-1/2', '*')):
        moves_str = moves_str.rsplit(' ', 1)[0]

    moves_str = re.sub(r'\s?\{[^}]*\}', '', moves_str)
    moves_str = re.sub(r'\s?\$\d{1,2}', '', moves_str)
    moves_str = re.sub(r'\s?\d+\.\.\.', '', moves_str)
    moves_str = re.sub(r'[?!]', '', moves_str)

    while re.search(r'\([^()]*\)', moves_str):
        moves_str = re.sub(r'\([^()]*\)', '', moves_str)

    moves_str = re.sub(r'\s+', ' ', moves_str).strip()
    if moves_str and moves_str[-1] != '.':
        last_space_index = moves_str.rfind(' ')
        if last_space_index != -1 and moves_str[last_space_index - 1] != '.':
            last_dot_index = moves_str.rfind('.')
            move_number_start = moves_str.rfind(' ', 0, last_dot_index) + 1
            move_number = int(moves_str[move_number_start:last_dot_index]) + 1
            moves_str += f" {move_number}."

    cleaned_lines = headers + [''] + [moves_str]
    return '\n'.join(cleaned_lines)


def read_game(pgn: str) -> chess.pgn.Game:
    return chess.pgn.read_game(io.StringIO(pgn))


def iter_games(path: str) -> Iterable[chess.pgn.Game]:
    with open(path, 'r', encoding='utf-8-sig') as handle:
        while True:
            game = chess.pgn.read_game(handle)
            if game is None:
                break
            yield game


def extract_moves_from_file(path: str) -> List[str]:
    all_moves: List[str] = []
    with open(path, 'r', encoding='utf-8-sig') as handle:
        games = handle.read().split('\n\n\n')

    for game in games:
        lines = game.split('\n')
        for line in lines:
            if not line.startswith('['):
                line = re.sub(r'\{[^}]*\}|\([^)]*\)', '', line)
                moves = line.split(' ')
                for move in moves:
                    if not re.match(r'\d+\.', move) and move and move not in {"1-0", "0-1", "1/2-1/2", "*"}:
                        all_moves.append(move)
    return all_moves


def generate_prompts(path: str) -> List[Tuple[int, int, str]]:
    prompts: List[Tuple[int, int, str]] = []
    game_index = 0

    with open(path, 'r', encoding='utf-8-sig') as pgn_file:
        while True:
            game = chess.pgn.read_game(pgn_file)
            if game is None:
                break
            game_index += 1

            header_lines = [
                f'[{key} "{game.headers[key]}"]'
                for key in ['Event', 'Site', 'Round', 'White', 'Black', 'WhiteElo', 'BlackElo', 'TimeControl']
                if key in game.headers
            ]
            header_str = '\n'.join(header_lines)

            node = game
            moves: List[str] = []
            while not node.is_end():
                next_node = node.variation(0)
                moves.append(node.board().san(next_node.move))
                node = next_node

            filtered_moves = [move for move in moves if move and not move[0].isdigit()]

            if not filtered_moves:
                continue

            prompts.append((game_index, 1, f"{header_str}\n\n1."))
            current_moves = "1."
            move_number = 1

            for index in range(len(filtered_moves) - 1):
                if index % 2 == 0:
                    current_moves += f" {filtered_moves[index]}"
                    prompts.append((game_index, move_number, f"{header_str}\n\n{current_moves}"))
                else:
                    current_moves += f" {filtered_moves[index]}"
                    if index + 1 < len(filtered_moves):
                        move_number += 1
                        current_moves += f" {move_number}."
                    prompts.append((game_index, move_number, f"{header_str}\n\n{current_moves}"))

    return prompts


__all__ = [
    "clean_pgn",
    "extract_moves_from_file",
    "generate_prompts",
    "iter_games",
    "read_game",
]
