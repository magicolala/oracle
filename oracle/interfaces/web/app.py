from __future__ import annotations

from dataclasses import replace
from typing import Any, Dict, Optional

from flask import Flask, render_template, request
import logging

from oracle.config import Settings, load_settings, resolve_value
from oracle.domain.models import GameContext
from oracle.interfaces.cli.bootstrap import create_single_move_predictor


logger = logging.getLogger(__name__)

OPENAI_API_KEY = ""
STOCKFISH_PATH = ""
MODEL_NAME = "gpt-3.5-turbo-instruct"
DEFAULT_DEPTH = 5
DEFAULT_PROB_THRESHOLD = 0.001

GAME_TYPES = {
    "bullet": "Bullet",
    "blitz": "Blitz",
    "rapid": "Rapide",
    "classical": "Classique",
}


def create_app(settings: Optional[Settings] = None) -> Flask:
    base_settings = load_settings() if settings is None else settings
    configured = _apply_overrides(base_settings)
    predictor = create_single_move_predictor(configured)

    app = Flask(__name__, template_folder="templates")
    app.logger.debug("Web application initialised with model=%s", configured.model_name)

    def render(form_data: Dict[str, Any], report=None, error: Optional[str] = None):
        return render_template(
            "index.html",
            form_data=form_data,
            game_types=GAME_TYPES,
            report=report,
            error=error,
        )

    @app.route("/", methods=["GET", "POST"])
    def index():
        app.logger.debug("Handling %s request", request.method)
        form_defaults = {
            "pgn": "",
            "white_elo": "",
            "black_elo": "",
            "game_type": "classical",
            "depth": str(DEFAULT_DEPTH),
            "prob_threshold": str(DEFAULT_PROB_THRESHOLD),
        }

        if request.method == "GET":
            app.logger.debug("Rendering empty form")
            return render(form_defaults)

        form_data = {
            "pgn": request.form.get("pgn", "").strip(),
            "white_elo": request.form.get("white_elo", "").strip(),
            "black_elo": request.form.get("black_elo", "").strip(),
            "game_type": request.form.get("game_type", "classical").strip() or "classical",
            "depth": request.form.get("depth", str(DEFAULT_DEPTH)).strip(),
            "prob_threshold": request.form.get("prob_threshold", str(DEFAULT_PROB_THRESHOLD)).strip(),
        }
        app.logger.debug(
            "Received form data (len_pgn=%s, white=%s, black=%s, type=%s, depth=%s, threshold=%s)",
            len(form_data["pgn"]),
            form_data["white_elo"] or "default",
            form_data["black_elo"] or "default",
            form_data["game_type"],
            form_data["depth"],
            form_data["prob_threshold"],
        )

        if not form_data["pgn"]:
            app.logger.warning("Missing PGN input")
            return render(form_data, error="Merci de fournir un PGN valide.")

        try:
            depth = max(1, min(7, int(form_data["depth"])))
        except ValueError:
            app.logger.warning("Invalid depth value=%s", form_data["depth"])
            return render(form_data, error="La profondeur doit etre un entier entre 1 et 7.")

        try:
            prob_threshold = float(form_data["prob_threshold"])
            if prob_threshold <= 0 or prob_threshold > 0.1:
                raise ValueError
        except ValueError:
            app.logger.warning("Invalid probability threshold value=%s", form_data["prob_threshold"])
            return render(form_data, error="Le seuil de probabilite doit etre compris entre 0.0001 et 0.1.")

        try:
            white_elo = int(form_data["white_elo"]) if form_data["white_elo"] else 2000
            black_elo = int(form_data["black_elo"]) if form_data["black_elo"] else 2000
        except ValueError:
            app.logger.warning(
                "Invalid Elo inputs white=%s black=%s",
                form_data["white_elo"],
                form_data["black_elo"],
            )
            return render(form_data, error="Les valeurs Elo doivent etre des entiers.")

        context = GameContext(
            pgn=form_data["pgn"],
            white_elo=white_elo,
            black_elo=black_elo,
            game_type=form_data["game_type"].lower(),
        )
        app.logger.debug(
            "Dispatching prediction (game_type=%s, white_elo=%s, black_elo=%s)",
            context.game_type,
            context.white_elo,
            context.black_elo,
        )

        try:
            report = predictor.predict(
                context,
                depth=depth,
                prob_threshold=prob_threshold,
            )
        except Exception as exc:  # noqa: BLE001
            app.logger.exception("Prediction failed", exc_info=exc)
            return render(form_data, error=f"Erreur lors de l'analyse : {exc}")

        app.logger.debug(
            "Prediction ready (rows=%s, elapsed=%.2fs)",
            len(report.rows),
            report.elapsed_seconds,
        )
        return render(form_data, report=report)

    return app


def _apply_overrides(settings: Settings) -> Settings:
    return replace(
        settings,
        openai_api_key=resolve_value(OPENAI_API_KEY, settings.openai_api_key),
        stockfish_path=resolve_value(STOCKFISH_PATH, settings.stockfish_path),
        model_name=resolve_value(MODEL_NAME, settings.model_name),
    )


__all__ = ["create_app"]
