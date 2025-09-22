# Repository Guidelines

## Project Structure & Key Modules
Code lives under `src/oracle`: the domain layer in `domain/` holds dataclasses and PGN helpers, the application layer in `application/` wires use cases, and `service/prediction.py` integrates Hugging Face and Stockfish.
FastAPI views are in `web/app.py` with templates in `templates/`. CLI utilities (`oracle_one_move.py`, `oracle_pgn_file.py`) sit at the repo root. Tests reside in `tests/units/`, while docs and assets live under `docs/`.

## Build, Test & Local Runs
Install deps with `poetry install`. Run linting via `poetry run ruff check . --fix` to auto-format and enforce style. Execute unit tests using `poetry run pytest`. For manual play, invoke `poetry run python oracle_one_move.py` and point `STOCKFISH_PATH` to your engine binary before running.

## Coding Style & Naming
Use four-space indentation, type hints, and concise docstrings. Respect Ruff's 100-character line limit and the rule sets enabled in `ruff.toml` (Bugbear, flake8-comprehensions, pyupgrade, etc.). Prefer descriptive snake_case for modules, functions, and variables; reserve CamelCase for classes like `PredictNextMoves`. Reuse shared helpers such as `clean_pgn`, `determine_game_type`, and `find_best_move_index` instead of reimplementing logic.

## Testing Guidelines
Write deterministic unit tests beside peers in `tests/units/`. Use pytest features (`monkeypatch`, fixtures) to isolate external APIs and engines. Name tests after the behavior under scrutiny (e.g., `test_predict_next_moves_handles_tactical_lines`). Run targeted suites with `poetry run pytest tests/units/application`. Strive to cover new branches and edge cases introduced by your changes.

## Commit & PR Workflow
Commit messages should follow the repo pattern: a brief, imperative subject (optionally scoped, e.g., `Fix:`) under ~60 characters. Group related edits per commit. Pull requests must describe the change, note configuration impacts, link issues, and attach CLI or UI screenshots when altering user flows. Ensure CI-critical commands (`ruff`, `pytest`) pass before requesting review.

## Security & Configuration
Never hard-code tokens or engine paths; rely on environment variables documented in `.env.example`. Update `OracleConfig`, README, and FastAPI/CLI entry points when introducing new configuration flags. Double-check that secrets stay out of git history and PR discussions.
