# Oracle Contribution Guide

**Note:** This project is a fork of the original `andy-landy/chess-llm-oracle` repository. This file has been adapted to reflect the current project structure and conventions.

## Scope

These guidelines apply to the entire repository.

## Architecture overview

- **Domain layer (`src/oracle/domain`)** – `__init__.py` defines the dataclasses (`OracleConfig`, `PredictionResult`, …) exchanged across the app, while `services.py` provides pure helpers for PGN normalisation, rating/time-control adjustments, Stockfish evaluation handling, and move-annotation logic.
- **Application layer (`src/oracle/application`)** – `ports.py` declares the `SequenceProvider` and `MoveAnalyzer` interfaces. `predict_next_moves.PredictNextMoves` composes those ports with the domain helpers to turn a PGN snippet into ranked move predictions and evaluation summaries.
- **Infrastructure adapters (`src/oracle/service/prediction.py`)** – Contains `HuggingFaceSequenceProvider`, `StockfishMoveAnalyzer`, and the `build_predict_next_moves_use_case` factory that wires external services (Hugging Face Inference API, Stockfish engine). Legacy compatibility helpers such as `get_top_sequences` and `predict_next_moves` also live here for scripts/tests.
- **User interfaces** –
  - [`oracle_one_move.py`](oracle_one_move.py) prompts for credentials, resolves player strength/time-control defaults, and prints the formatted move table for a single position.
  - [`oracle_pgn_file.py`](oracle_pgn_file.py) processes PGN batches while relying on the `oracle.service.prediction` helpers to fetch legal moves and evaluations.
  - [`src/oracle/web/app.py`](src/oracle/web/app.py) exposes a FastAPI front-end that renders `templates/index.html` and `templates/result.html`, acquiring a `PredictNextMoves` instance through dependency injection.

Review these modules before extending behaviour so new features respect the layering and reuse existing helpers.

## Configuration

Environment variables drive how adapters authenticate and locate binaries. The expected values are documented in `.env.example` and the README—keep all three sources in sync whenever new options are introduced.

- `HUGGINGFACEHUB_API_TOKEN` (optional) – Hugging Face Inference access token for higher rate limits or private models.
- `HUGGINGFACE_MODEL_ID` (optional) – Override for the default `mistralai/Mistral-7B-Instruct-v0.2` model.
- `STOCKFISH_PATH` (required by CLI/web) – Absolute path to the Stockfish engine binary.

When adding configuration flags, update `OracleConfig`, `.env.example`, `README.md`, and the FastAPI/CLI entry points to avoid drift.

## Testing guidelines

Prefer unit tests under `tests/units/` and isolate external services with stubs or monkeypatching:

- `tests/units/application/test_predict_next_moves.py` shows how to stub the sequence provider and engine adapters while asserting the orchestration logic.
- `tests/units/test_oracle_one_move.py` monkeypatches CLI prompts and wraps the factory to verify end-to-end wiring without live API calls.
- `tests/units/web/test_app.py` uses FastAPI’s dependency overrides plus async HTTPX clients to exercise the `/analyze` route with fake adapters.

Follow these patterns for new tests so the suite stays fast and deterministic.

## Quality checks

Run these commands and ensure they pass before committing changes:

- `poetry run ruff check . --fix`
- `poetry run pytest`

## Coding guidelines

- Continue to use typed function signatures and concise docstrings when touching shared helpers.
- Reuse domain services such as `clean_pgn`, `determine_game_type`, and `find_best_move_index` instead of duplicating logic.
- Place new unit tests alongside existing suites (`tests/units/...`) and extend fixtures/utilities (`tests.conftest`, PGN snippets) when introducing new scenarios.

## Documentation & release notes

Document user-visible changes in `docs/RELEASE_NOTES.md` and update `README.md` or the FastAPI templates when behaviour or configuration shifts. Align screenshots/assets under `docs/static` as needed.

## Operational cautions

Never commit real API tokens, Stockfish paths, or other secrets. Use environment variables or local `.env` files that remain untracked.
