"""FastAPI application exposing Oracle predictions."""
from __future__ import annotations

import os
from pathlib import Path
from typing import TYPE_CHECKING

from fastapi import Depends, FastAPI, Form, HTTPException, Request
from fastapi.concurrency import run_in_threadpool
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from oracle.domain import OracleConfig
from oracle.service.prediction import build_predict_next_moves_use_case

if TYPE_CHECKING:
    from oracle.application.ports import PredictNextMovesUseCase

TEMPLATES_DIR = Path(__file__).resolve().parent / "templates"

app = FastAPI()
templates = Jinja2Templates(directory=str(TEMPLATES_DIR))


def get_oracle_config() -> OracleConfig:
    return OracleConfig()


@app.get("/", response_class=HTMLResponse)
async def index(request: Request) -> HTMLResponse:
    return templates.TemplateResponse(request, "index.html")


def get_prediction_service(
    config: OracleConfig = Depends(get_oracle_config),  # noqa: B008
) -> PredictNextMovesUseCase:
    stockfish_path = os.getenv("STOCKFISH_PATH")
    if not stockfish_path or not stockfish_path.strip():
        raise HTTPException(status_code=500, detail="STOCKFISH_PATH environment variable not set")

    model_id = os.getenv("HUGGINGFACE_MODEL_ID")
    resolved_model = model_id.strip() if model_id and model_id.strip() else config.huggingface_model

    token = os.getenv("HUGGINGFACEHUB_API_TOKEN")
    resolved_token = (
        token.strip() if token and token.strip() else config.huggingface_token
    )

    return build_predict_next_moves_use_case(
        config,
        stockfish_path=stockfish_path.strip(),
        huggingface_model=resolved_model,
        huggingface_token=resolved_token,
    )


@app.post("/analyze", response_class=HTMLResponse)
async def analyze(
    request: Request,
    pgn: str = Form(...),
    service: PredictNextMovesUseCase = Depends(get_prediction_service),  # noqa: B008
) -> HTMLResponse:
    try:
        prediction = await run_in_threadpool(service.execute, pgn)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    context = {
        "predictions": prediction.moves,
        "current_win_percentage": prediction.current_win_percentage,
        "metrics": prediction.metrics,
    }
    return templates.TemplateResponse(request, "result.html", context)
