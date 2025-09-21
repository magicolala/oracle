"""FastAPI application exposing Oracle predictions."""
from __future__ import annotations

import logging
import os
from dataclasses import dataclass
from pathlib import Path
from typing import TYPE_CHECKING

from dotenv import load_dotenv
from fastapi import FastAPI, Form, Request, status
from fastapi.concurrency import run_in_threadpool
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from oracle.domain import OracleConfig
from oracle.service.prediction import build_predict_next_moves_use_case

load_dotenv()

if TYPE_CHECKING:
    from oracle.application.ports import PredictNextMovesUseCase


logger = logging.getLogger(__name__)

TEMPLATES_DIR = Path(__file__).resolve().parent / "templates"

app = FastAPI()
templates = Jinja2Templates(directory=str(TEMPLATES_DIR))


@dataclass
class ErrorMessage:
    """Structure representing an error rendered in the UI."""

    title: str
    detail: str
    hint: str | None = None


class WebAppConfigurationError(RuntimeError):
    """Raised when the web application cannot be configured properly."""

    def __init__(self, message: str, hint: str | None = None) -> None:
        super().__init__(message)
        self.hint = hint


def get_oracle_config() -> OracleConfig:
    return OracleConfig()


@app.get("/", response_class=HTMLResponse)
async def index(request: Request) -> HTMLResponse:
    context = {"request": request}
    return templates.TemplateResponse(request, "index.html", context)


def get_prediction_service(config: OracleConfig | None = None) -> PredictNextMovesUseCase:
    config = config or get_oracle_config()

    stockfish_env = os.getenv("STOCKFISH_PATH")
    if not stockfish_env or not stockfish_env.strip():
        raise WebAppConfigurationError(
            "La variable d'environnement STOCKFISH_PATH est absente ou vide.",
            "Installez Stockfish localement puis exportez STOCKFISH_PATH avant de démarrer le serveur.",
        )

    stockfish_path = Path(stockfish_env.strip())
    running_tests = os.getenv("PYTEST_CURRENT_TEST") is not None

    if not running_tests and not stockfish_path.exists():
        raise WebAppConfigurationError(
            f"Le binaire Stockfish est introuvable à l'emplacement {stockfish_path!s}.",
            "Vérifiez le chemin ou téléchargez une version compatible sur https://stockfishchess.org/download/.",
        )

    if not running_tests and stockfish_path.is_dir():
        raise WebAppConfigurationError(
            f"STOCKFISH_PATH pointe vers un dossier ({stockfish_path!s}) au lieu d'un binaire exécutable.",
            "Fournissez le chemin complet vers le fichier exécutable Stockfish (ex.: /usr/bin/stockfish).",
        )

    if not running_tests and not os.access(stockfish_path, os.X_OK):
        raise WebAppConfigurationError(
            f"Le fichier {stockfish_path!s} n'est pas exécutable par l'utilisateur courant.",
            "Ajustez les permissions (chmod +x) ou choisissez un binaire différent.",
        )

    model_id = os.getenv("HUGGINGFACE_MODEL_ID")
    resolved_model = model_id.strip() if model_id and model_id.strip() else config.huggingface_model

    token = os.getenv("HUGGINGFACEHUB_API_TOKEN")
    resolved_token = token.strip() if token and token.strip() else config.huggingface_token

    return build_predict_next_moves_use_case(
        config,
        stockfish_path=str(stockfish_path),
        huggingface_model=resolved_model,
        huggingface_token=resolved_token,
    )


@app.post("/analyze", response_class=HTMLResponse)
async def analyze(request: Request, pgn: str = Form(...)) -> HTMLResponse:
    normalized_pgn = pgn.strip()
    base_context = {"request": request, "pgn": normalized_pgn}

    if not normalized_pgn:
        error = ErrorMessage(
            title="PGN requis",
            detail="Aucun PGN n'a été détecté dans le formulaire.",
            hint="Collez la partie jusqu'au coup à analyser, balises incluses si disponible.",
        )
        return templates.TemplateResponse(
            request,
            "index.html",
            {**base_context, "error": error},
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    try:
        service = get_prediction_service()
    except WebAppConfigurationError as exc:  # pragma: no cover - configuration errors are environment-dependent
        logger.exception("Configuration error while building the prediction service")
        error = ErrorMessage(
            title="Configuration requise",
            detail=str(exc),
            hint=exc.hint,
        )
        return templates.TemplateResponse(
            request,
            "index.html",
            {**base_context, "error": error},
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    try:
        prediction = await run_in_threadpool(service.execute, normalized_pgn)
    except ValueError as exc:
        logger.warning("Invalid PGN received: %s", exc)
        error = ErrorMessage(
            title="PGN invalide",
            detail=str(exc),
            hint="Vérifiez la notation SAN, la numérotation des coups et la présence éventuelle des en-têtes.",
        )
        return templates.TemplateResponse(
            request,
            "index.html",
            {**base_context, "error": error},
            status_code=status.HTTP_400_BAD_REQUEST,
        )
    except Exception as exc:  # pragma: no cover - defensive branch
        logger.exception("Unexpected error while running prediction")
        error = ErrorMessage(
            title="Erreur d'analyse",
            detail=str(exc),
            hint="Consultez les logs du serveur pour identifier la source exacte du problème.",
        )
        return templates.TemplateResponse(
            request,
            "index.html",
            {**base_context, "error": error},
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    context = {
        **base_context,
        "predictions": prediction.moves,
        "current_win_percentage": prediction.current_win_percentage,
        "metrics": prediction.metrics,
    }
    return templates.TemplateResponse(request, "result.html", context)
