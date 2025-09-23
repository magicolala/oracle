import logging
import os
from dataclasses import replace

from oracle.config import Settings, load_settings, resolve_value
from oracle.interfaces.web.app import create_app

OPENAI_API_KEY = ""
STOCKFISH_PATH = ""
MODEL_NAME = "gpt-3.5-turbo-instruct"
HOST = os.getenv("ORACLE_WEB_HOST", "127.0.0.1")
PORT = int(os.getenv("ORACLE_WEB_PORT", "8000"))
DEBUG = os.getenv("ORACLE_WEB_DEBUG", "false").lower() == "true"
LOG_LEVEL = os.getenv("ORACLE_WEB_LOG_LEVEL", "DEBUG").upper()
LOG_FORMAT = os.getenv(
    "ORACLE_WEB_LOG_FORMAT",
    "%(asctime)s [%(levelname)s] %(name)s - %(message)s",
)


def _apply_overrides(settings: Settings) -> Settings:
    return replace(
        settings,
        openai_api_key=resolve_value(OPENAI_API_KEY, settings.openai_api_key),
        stockfish_path=resolve_value(STOCKFISH_PATH, settings.stockfish_path),
        model_name=resolve_value(MODEL_NAME, settings.model_name),
    )


if __name__ == "__main__":
    logging.basicConfig(level=LOG_LEVEL, format=LOG_FORMAT)
    logging.getLogger(__name__).debug(
        "Starting Oracle web server host=%s port=%s debug=%s log_level=%s",
        HOST,
        PORT,
        DEBUG,
        LOG_LEVEL,
    )
    settings = _apply_overrides(load_settings())
    app = create_app(settings)
    app.run(host=HOST, port=PORT, debug=DEBUG)
