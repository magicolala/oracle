"""FastAPI application exposing Oracle predictions."""
from __future__ import annotations

import io
import logging
import os
from dataclasses import dataclass
from pathlib import Path
from typing import TYPE_CHECKING

import chess
import chess.pgn
from dotenv import load_dotenv
from fastapi import FastAPI, Form, Request, status
from fastapi.concurrency import run_in_threadpool
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel, ConfigDict

from oracle.domain import OracleConfig
from oracle.domain.services import clean_pgn, determine_game_type
from oracle.service.prediction import build_predict_next_moves_use_case

load_dotenv()

if TYPE_CHECKING:
    from oracle.application.ports import PredictNextMovesUseCase


logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent
TEMPLATES_DIR = BASE_DIR / "templates"
STATIC_DIR = BASE_DIR / "static"

app = FastAPI()
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")
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


class PlayMoveRequest(BaseModel):
    """JSON payload accepted by the move endpoint."""

    model_config = ConfigDict(extra="ignore")

    pgn: str | None = None
    fen: str | None = None
    level: int | str | None = None
    move: str | None = None


class NewGameRequest(BaseModel):
    """JSON payload accepted by the new game endpoint."""

    model_config = ConfigDict(extra="ignore")

    level: int | str | None = None


def get_oracle_config() -> OracleConfig:
    return OracleConfig()


def build_level_options(config: OracleConfig) -> list[dict[str, str]]:
    """Return level options ready to be consumed by the template."""

    options: list[dict[str, str]] = []
    for level in config.available_levels:
        time_control = config.time_control_for_level(level) or ""
        label = f"Elo {level}"
        if time_control:
            game_type = determine_game_type(time_control)
            if game_type == "Unknown":
                game_type = config.default_game_type
            label = f"Elo {level} • {game_type.capitalize()} ({time_control})"
        options.append({"value": str(level), "label": label})
    return options


@app.get("/", response_class=HTMLResponse, name="index")
async def index(request: Request) -> HTMLResponse:
    config = get_oracle_config()
    requested_mode = request.query_params.get("mode", "analyze").strip().lower()
    active_mode = requested_mode if requested_mode in {"analyze", "play"} else "analyze"
    context = {
        "request": request,
        "levels": build_level_options(config),
        "selected_level": "",
        "pgn": "",
        "active_mode": active_mode,
    }
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


def _json_error(
    status_code: int,
    message: str,
    code: str,
    *,
    detail: str | None = None,
    hint: str | None = None,
) -> JSONResponse:
    """Create a JSON error response payload."""

    payload: dict[str, dict[str, str]] = {"error": {"code": code, "message": message}}
    if detail:
        payload["error"]["detail"] = detail
    if hint:
        payload["error"]["hint"] = hint
    return JSONResponse(status_code=status_code, content=payload)


def _resolve_level(
    level_value: int | str | None,
    config: OracleConfig,
) -> tuple[int | None, JSONResponse | None]:
    """Validate the requested level against the configuration."""

    if level_value is None:
        return None, None

    if isinstance(level_value, str):
        raw_value = level_value.strip()
        if not raw_value:
            return None, None
        try:
            resolved = int(raw_value)
        except ValueError:
            return None, _json_error(
                status.HTTP_400_BAD_REQUEST,
                "Niveau invalide",
                "invalid_level",
                detail="Le niveau sélectionné doit être un entier.",
                hint="Choisissez un niveau proposé dans la liste déroulante.",
            )
    else:
        resolved = int(level_value)

    if resolved not in config.available_levels:
        return None, _json_error(
            status.HTTP_400_BAD_REQUEST,
            "Niveau inconnu",
            "unknown_level",
            detail="La valeur fournie ne correspond à aucun niveau pris en charge.",
            hint="Sélectionnez un niveau listé dans l'interface ou laissez le champ vide.",
        )

    return resolved, None


def _ensure_time_control_header(pgn: str, time_control: str) -> str:
    """Guarantee that the PGN contains the requested time control header."""

    if not time_control:
        return pgn

    header_line = f'[TimeControl "{time_control}"]'
    lines = pgn.splitlines()

    for index, line in enumerate(lines):
        if line.startswith("[TimeControl "):
            lines[index] = header_line
            break
    else:
        insert_index = 0
        while insert_index < len(lines) and lines[insert_index].startswith("["):
            insert_index += 1
        lines.insert(insert_index, header_line)

    return "\n".join(lines)


def _build_game_state(
    pgn: str,
) -> tuple[chess.pgn.Game, chess.pgn.GameNode, chess.Board]:
    """Return the parsed PGN, its final node and associated board."""

    cleaned = clean_pgn(pgn)
    game = chess.pgn.read_game(io.StringIO(cleaned))
    if game is None:
        raise ValueError("Unable to parse PGN content")
    final_node = game.end()
    board = final_node.board()
    return game, final_node, board


@app.post("/analyze", response_class=HTMLResponse)
async def analyze(
    request: Request,
    pgn: str = Form(...),
    level: str | None = Form(None),
) -> HTMLResponse:
    config = get_oracle_config()
    level_options = build_level_options(config)
    normalized_pgn = pgn.strip()
    selected_level_raw = (level or "").strip()
    base_context = {
        "request": request,
        "pgn": normalized_pgn,
        "levels": level_options,
        "selected_level": selected_level_raw,
        "active_mode": "analyze",
    }

    selected_level_value: int | None = None
    if selected_level_raw:
        try:
            selected_level_value = int(selected_level_raw)
        except ValueError:
            error = ErrorMessage(
                title="Niveau invalide",
                detail="Le niveau sélectionné doit être une valeur numérique connue.",
                hint="Sélectionnez un niveau proposé dans la liste déroulante ou laissez le champ vide pour utiliser les informations du PGN.",
            )
            return templates.TemplateResponse(
                request,
                "index.html",
                {**base_context, "error": error},
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        if selected_level_value not in config.available_levels:
            error = ErrorMessage(
                title="Niveau inconnu",
                detail="La valeur sélectionnée ne correspond à aucun niveau pris en charge.",
                hint="Choisissez un niveau parmi les options affichées ou laissez le champ vide pour conserver le PGN tel quel.",
            )
            return templates.TemplateResponse(
                request,
                "index.html",
                {**base_context, "error": error},
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        base_context["selected_level"] = str(selected_level_value)

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
        service = get_prediction_service(config=config)
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
        execution_kwargs = {}
        if selected_level_value is not None:
            execution_kwargs["selected_level"] = selected_level_value
        prediction = await run_in_threadpool(
            service.execute,
            normalized_pgn,
            **execution_kwargs,
        )
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
        "history": prediction.history,
        "latest": prediction.last(),
        "current_win_percentage": prediction.current_win_percentage,
        "metrics": prediction.metrics,
    }
    return templates.TemplateResponse(request, "result.html", context)


@app.post("/play/new")
async def start_new_game(payload: NewGameRequest) -> JSONResponse:
    """Initialise a new game session for the play mode."""

    config = get_oracle_config()
    selected_level, error_response = _resolve_level(payload.level, config)
    if error_response:
        return error_response

    if selected_level is not None:
        status_message = f"Partie démarrée au niveau Elo {selected_level}."
    else:
        status_message = "La partie a démarré."

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "pgn": "",
            "fen": chess.STARTING_FEN,
            "finished": False,
            "status": status_message,
            "level": selected_level,
        },
    )


@app.post("/play/move")
async def play_next_move(payload: PlayMoveRequest) -> JSONResponse:
    """Return the computer move for the provided PGN position."""

    logger.info("[DEBUG] /play/move called with payload: %s", payload.model_dump())

    config = get_oracle_config()
    selected_level, error_response = _resolve_level(payload.level, config)
    if error_response:
        logger.warning("[DEBUG] Level resolution error: %s", error_response.body)
        return error_response

    normalized_pgn = (payload.pgn or "").strip()
    logger.info("[DEBUG] Normalized PGN: %s", normalized_pgn)
    if not normalized_pgn:
        return _json_error(
            status.HTTP_400_BAD_REQUEST,
            "PGN requis",
            "missing_pgn",
            detail="Le PGN actuel est nécessaire pour calculer la réponse de l'ordinateur.",
        )

    play_time_control = config.time_control_for_mode("play") or config.play_mode_time_control
    if play_time_control:
        normalized_pgn = _ensure_time_control_header(normalized_pgn, play_time_control)
        logger.info("[DEBUG] PGN with time control: %s", normalized_pgn)

    try:
        service = get_prediction_service(config=config)
    except WebAppConfigurationError as exc:  # pragma: no cover - env dependent
        logger.exception("Configuration error while building the prediction service")
        return _json_error(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            "Configuration requise",
            "configuration_error",
            detail=str(exc),
            hint=exc.hint,
        )

    execution_kwargs = {"mode": "play"}
    if selected_level is not None:
        execution_kwargs["selected_level"] = selected_level
        logger.info("[DEBUG] Using selected level: %s", selected_level)

    try:
        logger.info("[DEBUG] Calling prediction service with PGN length: %d", len(normalized_pgn))
        prediction = await run_in_threadpool(
            service.execute,
            normalized_pgn,
            **execution_kwargs,
        )
        logger.info("[DEBUG] Prediction completed, history length: %d", len(prediction.history))
    except ValueError as exc:
        logger.warning("Invalid PGN received on /play/move: %s", exc)
        return _json_error(
            status.HTTP_400_BAD_REQUEST,
            "PGN invalide",
            "invalid_pgn",
            detail=str(exc),
        )
    except Exception as exc:  # pragma: no cover - defensive branch
        logger.exception("Unexpected error while running prediction for /play/move")
        return _json_error(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            "Erreur d'analyse",
            "prediction_error",
            detail=str(exc),
        )

    snapshot = prediction.last()
    logger.info("[DEBUG] Last snapshot PGN length: %d", len(snapshot.pgn) if snapshot else 0)
    if snapshot is None:
        logger.error("[DEBUG] No snapshot returned from prediction")
        return _json_error(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            "Résultat indisponible",
            "empty_prediction",
            detail="Le service de prédiction n'a retourné aucun résultat.",
        )

    try:
        game, node, board = _build_game_state(snapshot.pgn)
        logger.info("[DEBUG] Game state built, current FEN: %s", board.fen())
    except ValueError as exc:
        logger.warning("Unable to rebuild game state from snapshot: %s", exc)
        return _json_error(
            status.HTTP_400_BAD_REQUEST,
            "PGN invalide",
            "invalid_pgn",
            detail=str(exc),
        )

    candidate_moves = snapshot.moves
    logger.info("[DEBUG] Candidate moves count: %d", len(candidate_moves))
    exporter = chess.pgn.StringExporter(headers=True, variations=False, comments=False)

    if not candidate_moves:
        stable_pgn = game.accept(exporter).strip()
        logger.info("[DEBUG] No moves available, returning finished game")
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "pgn": stable_pgn,
                "fen": board.fen(),
                "finished": True,
                "status": "Aucun coup légal disponible.",
            },
        )

    best_move = next((move for move in candidate_moves if move.is_best_move), candidate_moves[0])
    logger.info("[DEBUG] Best move selected: %s", best_move.move)

    try:
        parsed_move = board.parse_san(best_move.move)
        logger.info("[DEBUG] Move parsed successfully: %s", parsed_move)
    except ValueError as exc:  # pragma: no cover - defensive branch
        logger.exception("Invalid SAN received from prediction: %s", best_move.move)
        return _json_error(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            "Coup illégal",
            "invalid_prediction_move",
            detail=str(exc),
        )

    new_node = node.add_variation(parsed_move)
    updated_pgn = game.accept(exporter).strip()
    response_board = new_node.board()
    finished = response_board.is_game_over()

    logger.info("[DEBUG] Computer move added, new PGN length: %d, finished: %s", len(updated_pgn), finished)

    response_payload = {
        "move": {
            "san": best_move.move,
            "notation": best_move.notation,
            "likelihood": best_move.likelihood,
            "win_percentage": best_move.win_percentage,
            "win_percentage_by_rating": best_move.win_percentage_by_rating,
            "is_best": best_move.is_best_move,
            "principal_variation": best_move.principal_variation,
        },
        "pgn": updated_pgn,
        "fen": response_board.fen(),
        "finished": finished,
        "status": f"Coup joué par l'ordinateur: {best_move.move}",
    }

    logger.info("[DEBUG] Returning response with PGN length: %d", len(updated_pgn))
    return JSONResponse(status_code=status.HTTP_200_OK, content=response_payload)
