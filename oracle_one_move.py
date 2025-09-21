"""Command-line interface for Oracle predictions."""
from __future__ import annotations

import logging
import os
import re

from tabulate import tabulate

from oracle.service.prediction import (
    MovePrediction,
    OracleConfig,
    adjust_rating,
    determine_game_type,
    predict_next_moves,
)

DEFAULT_HUGGINGFACE_MODEL_ID = "mistralai/Mistral-7B-Instruct-v0.2"
HUGGINGFACE_TOKEN = os.getenv("HUGGINGFACEHUB_API_TOKEN", "")
HUGGINGFACE_MODEL_ID = os.getenv("HUGGINGFACE_MODEL_ID", "")
STOCKFISH_PATH = os.getenv("STOCKFISH_PATH", "")

logger = logging.getLogger(__name__)


def _collect_pgn_from_stdin() -> str:
    pgn_content: list[str] = []
    while True:
        line = input()
        if line.strip().upper() == "END":
            break
        pgn_content.append(line)
    return "\n".join(pgn_content)


def _extract_or_prompt_elo(match: re.Match[str] | None, prompt: str) -> int:
    if match:
        return int(match.group(1))
    return int(input(prompt))


def _resolve_game_type(pgn_content: str) -> str:
    time_control_match = re.search(r'\[TimeControl\s+"([^"]+)"\]', pgn_content)
    if time_control_match:
        time_control = time_control_match.group(1)
        game_type = determine_game_type(time_control)
        if game_type != "Unknown":
            return game_type
    return input("Enter the game type (bullet, blitz, rapid, classical): ").strip().lower()


def _format_predictions(predictions: list[MovePrediction]) -> str:
    headers = ["#", "Move", "Likelihood", "Evaluation"]
    rows = [
        [
            f"#{idx + 1}",
            f"{prediction.move}{prediction.notation}",
            f"{prediction.likelihood:.2f}%",
            f"{prediction.win_percentage:.2f}%",
        ]
        for idx, prediction in enumerate(predictions[:5])
    ]
    return tabulate(rows, headers=headers, tablefmt="pretty")


def main() -> None:
    logging.basicConfig(level=logging.DEBUG)
    logger.info('Enter the PGN (type "END" on a new line to finish):')
    pgn_content = _collect_pgn_from_stdin()

    hf_token_default = HUGGINGFACE_TOKEN.strip()
    if hf_token_default:
        hf_token_prompt = input(
            "Press Enter to keep your Hugging Face token or paste a new one "
            "(free-tier public models work without a token): "
        ).strip()
        hf_token = hf_token_prompt or hf_token_default
    else:
        hf_token = input(
            "Enter your Hugging Face token (press Enter to try free-tier/anonymous access): "
        ).strip()

    resolved_model_default = HUGGINGFACE_MODEL_ID.strip() or DEFAULT_HUGGINGFACE_MODEL_ID
    hf_model_prompt = input(
        "Enter the Hugging Face model ID (press Enter to use "
        f"'{resolved_model_default}' or another free-tier option): "
    ).strip()
    hf_model = hf_model_prompt or resolved_model_default
    engine_path = STOCKFISH_PATH or input("Enter the path to your Stockfish binary: ").strip()

    game_type = _resolve_game_type(pgn_content)
    white_elo_match = re.search(r'\[WhiteElo\s+"(\d+)"\]', pgn_content)
    black_elo_match = re.search(r'\[BlackElo\s+"(\d+)"\]', pgn_content)

    white_elo = _extract_or_prompt_elo(white_elo_match, "Input White Elo: ")
    black_elo = _extract_or_prompt_elo(black_elo_match, "Input Black Elo: ")

    white_elo = adjust_rating(white_elo, game_type)
    black_elo = adjust_rating(black_elo, game_type)

    config = OracleConfig(
        stockfish_path=engine_path,
        huggingface_token=hf_token or None,
        huggingface_model=hf_model,
        default_white_elo=white_elo,
        default_black_elo=black_elo,
        default_game_type=game_type,
    )

    result = predict_next_moves(pgn_content, config)

    table = _format_predictions(result.moves)
    logger.debug("\n%s", table)
    logger.debug("Current Evaluation: %.2f%%", result.current_win_percentage)


if __name__ == "__main__":
    main()
