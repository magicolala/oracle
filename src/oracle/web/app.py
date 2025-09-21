"""FastAPI application exposing Oracle predictions."""
from __future__ import annotations

import os
from pathlib import Path

from fastapi import Depends, FastAPI, Form, HTTPException, Request
from fastapi.concurrency import run_in_threadpool
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from oracle.service.prediction import OracleConfig, predict_next_moves

TEMPLATES_DIR = Path(__file__).resolve().parent / "templates"

app = FastAPI()
templates = Jinja2Templates(directory=str(TEMPLATES_DIR))


def get_oracle_config() -> OracleConfig:
    stockfish_path = os.getenv("STOCKFISH_PATH")
    if not stockfish_path:
        raise HTTPException(status_code=500, detail="STOCKFISH_PATH environment variable not set")
    huggingface_token = os.getenv("HUGGINGFACEHUB_API_TOKEN")
    model_id = os.getenv("HUGGINGFACE_MODEL_ID")
    config_kwargs: dict[str, str | None] = {}
    if model_id:
        config_kwargs["huggingface_model"] = model_id
    if huggingface_token:
        config_kwargs["huggingface_token"] = huggingface_token
    return OracleConfig(stockfish_path=stockfish_path, **config_kwargs)


@app.get("/", response_class=HTMLResponse)
async def index(request: Request) -> HTMLResponse:
    return templates.TemplateResponse(request, "index.html")


@app.post("/analyze", response_class=HTMLResponse)
async def analyze(
    request: Request,
    pgn: str = Form(...),
    config: OracleConfig = Depends(get_oracle_config),  # noqa: B008
) -> HTMLResponse:
    try:
        prediction = await run_in_threadpool(predict_next_moves, pgn, config)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    context = {
        "predictions": prediction.moves,
        "current_win_percentage": prediction.current_win_percentage,
        "metrics": prediction.metrics,
    }
    return templates.TemplateResponse(request, "result.html", context)
