import os
from dataclasses import dataclass
from typing import Optional


DEFAULT_MODEL = "gpt-3.5-turbo-instruct"


@dataclass
class Settings:
    openai_api_key: str = ""
    stockfish_path: str = ""
    model_name: str = DEFAULT_MODEL
    time_limit: float = 1.3
    depth: int = 20
    threads: int = 8
    hash_size: int = 512


def load_settings() -> Settings:
    """Load configuration from environment variables."""
    return Settings(
        openai_api_key=os.getenv("OPENAI_API_KEY", ""),
        stockfish_path=os.getenv("STOCKFISH_PATH", ""),
        model_name=os.getenv("OPENAI_MODEL", DEFAULT_MODEL),
        time_limit=float(os.getenv("STOCKFISH_TIME_LIMIT", 1.3)),
        depth=int(os.getenv("STOCKFISH_DEPTH", 20)),
        threads=int(os.getenv("STOCKFISH_THREADS", 8)),
        hash_size=int(os.getenv("STOCKFISH_HASH", 512)),
    )


def resolve_value(explicit: Optional[str], fallback: str) -> str:
    return explicit if explicit not in (None, "") else fallback


__all__ = ["Settings", "load_settings", "resolve_value", "DEFAULT_MODEL"]
