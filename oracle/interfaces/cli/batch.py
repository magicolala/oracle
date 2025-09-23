import csv
from pathlib import Path

from oracle.config import Settings
from oracle.interfaces.cli.bootstrap import create_batch_service


def run_batch_cli(
    settings: Settings,
    pgn_path: str,
    output_path: str,
    depth: int = 5,
    prob_threshold: float = 0.001,
    default_rating: int = 2000,
    default_game_type: str = "classical",
) -> None:
    _assert_configuration(settings, pgn_path)
    batch_service = create_batch_service(settings)
    summary = batch_service.analyse_file(
        pgn_path,
        depth=depth,
        prob_threshold=prob_threshold,
        default_rating=default_rating,
        default_game_type=default_game_type,
    )

    output = Path(output_path)
    output.parent.mkdir(parents=True, exist_ok=True)

    with output.open('w', newline='') as csvfile:
        fieldnames = [
            'game_index',
            'movenumber',
            'white_or_black',
            'prediction',
            'notation',
            'raw_prob',
            'new_norm_prob',
            'win_percentage',
            'eval_centipawns',
            'eval_with_mate',
            'is_played',
            'best_move_importance',
            'rating',
            'game_type',
        ]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for row in summary.rows:
            writer.writerow(
                {
                    'game_index': row.game_index,
                    'movenumber': row.move_number,
                    'white_or_black': row.side_to_move,
                    'prediction': row.prediction,
                    'notation': row.notation,
                    'raw_prob': row.raw_probability,
                    'new_norm_prob': row.normalized_probability,
                    'win_percentage': row.win_percentage,
                    'eval_centipawns': row.eval_centipawns,
                    'eval_with_mate': row.eval_with_mate,
                    'is_played': 1 if row.is_played else 0,
                    'best_move_importance': row.best_move_importance,
                    'rating': row.rating,
                    'game_type': row.game_type,
                }
            )

    print(f"Final results saved to {output}")
    print(f"Total moves processed: {summary.total_moves}")
    print(f"Total Time taken: {summary.elapsed_seconds:.2f} seconds")
    print(f"Total input tokens: {summary.usage.input_tokens}")
    print(f"Total output tokens: {summary.usage.output_tokens}")


def _assert_configuration(settings: Settings, pgn_path: str) -> None:
    if not settings.openai_api_key:
        raise RuntimeError("OpenAI API key is missing. Set OPENAI_API_KEY or update the script configuration.")
    if not settings.stockfish_path:
        raise RuntimeError("Stockfish path is missing. Set STOCKFISH_PATH or update the script configuration.")
    if not Path(pgn_path).exists():
        raise FileNotFoundError(f"PGN file not found: {pgn_path}")


__all__ = ["run_batch_cli"]
