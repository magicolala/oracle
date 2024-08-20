from pathlib import Path
from typing import Generator

DATA_FOLDER = Path(__file__).parent / "data"


def get_list_pgn() -> Generator[str, None, None]:
    """Get list of pgn files."""
    generator = DATA_FOLDER.glob("*.pgn")

    for pgn_file in generator:
        content = pgn_file.read_text(encoding="utf-8")
        yield content
