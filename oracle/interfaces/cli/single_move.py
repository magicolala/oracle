import re
from typing import Optional

from tabulate import tabulate

from oracle.config import Settings
from oracle.domain.models import GameContext
from oracle.interfaces.cli.bootstrap import create_single_move_predictor
from oracle.services.evaluation import determine_game_type
from oracle.services.reporting import highlight_move


def run_single_move_cli(settings: Settings, depth: int = 5, prob_threshold: float = 0.001) -> None:
    _assert_configuration(settings)
    predictor = create_single_move_predictor(settings)

    print('Enter the PGN (type "END" on a new line to finish):')
    pgn_lines = []
    while True:
        line = input()
        if line.strip().upper() == "END":
            break
        pgn_lines.append(line)

    pgn_content = "\n".join(pgn_lines)
    if not pgn_content.strip():
        print("No PGN provided. Exiting.")
        return

    game_type = _resolve_game_type(pgn_content)
    white_elo = _resolve_elo(pgn_content, 'WhiteElo', prompt='Input White Elo: ')
    black_elo = _resolve_elo(pgn_content, 'BlackElo', prompt='Input Black Elo: ')

    context = GameContext(
        pgn=pgn_content,
        white_elo=white_elo,
        black_elo=black_elo,
        game_type=game_type,
    )

    report = predictor.predict(context, depth=depth, prob_threshold=prob_threshold)

    print(f"Total Time taken: {report.elapsed_seconds:.2f} seconds")
    print(f"Total input tokens: {report.usage.input_tokens}")
    print(f"Total output tokens: {report.usage.output_tokens}")
    print(f"Total cost: ${report.usage.cost_usd:.6f}")
    print(f"\n        Current Evaluation: {report.current_win_percentage:.2f}%")

    rows_to_display = report.rows[:3]
    if not any(row.is_best for row in rows_to_display):
        best_row = next((row for row in report.rows if row.is_best), None)
        if best_row:
            rows_to_display.append(best_row)

    table_data = []
    for index, prediction in enumerate(rows_to_display, start=1):
        move_label = highlight_move(f"{prediction.move}{prediction.notation}", prediction.color_code)
        table_data.append(
            [
                f"#{index}",
                move_label,
                f"{prediction.normalized_probability:.2f}%",
                f"{prediction.win_percentage:.2f}%",
            ]
        )

    headers = ["#", "Move", "Likelihood", "Evaluation"]
    print(tabulate(table_data, headers=headers, tablefmt="pretty"))


def _assert_configuration(settings: Settings) -> None:
    if not settings.openai_api_key:
        raise RuntimeError("OpenAI API key is missing. Set OPENAI_API_KEY or update the script configuration.")
    if not settings.stockfish_path:
        raise RuntimeError("Stockfish path is missing. Set STOCKFISH_PATH or update the script configuration.")


def _resolve_game_type(pgn_content: str) -> str:
    match = re.search(r'\[TimeControl\s+"([^"]+)"\]', pgn_content)
    if match:
        return determine_game_type(match.group(1))
    game_type = input("Enter the game type (bullet, blitz, rapid, classical): ").strip().lower()
    if game_type not in {"bullet", "blitz", "rapid", "classical"}:
        print("Unknown game type. Defaulting to classical.")
        return "classical"
    return game_type


def _resolve_elo(pgn_content: str, tag: str, prompt: str) -> int:
    match = re.search(rf'\[{tag}\s+"(\d+)"\]', pgn_content)
    if match:
        return int(match.group(1))
    while True:
        try:
            return int(input(prompt))
        except ValueError:
            print("Please enter a valid integer rating.")


__all__ = ["run_single_move_cli"]
