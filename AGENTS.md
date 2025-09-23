# Repository Guidelines

## Project Structure & Module Organization
Oracle currently lives in two top-level Python scripts: `Oracle_one_move` for single-position forecasts and `Oracle_pgn_file` for batch PGN evaluation. Supporting assets (README, licensing, images) remain at the repository root. Add shared Python utilities under an `oracle/` package and keep temporary experiments in `experiments/` with clear naming. Place all new tests in `tests/`, mirroring module names so fixtures and helpers are easy to locate.

## Build, Test, and Development Commands
Use Python 3.10+ in an isolated environment: `python -m venv .venv` then activate it. Install runtime dependencies with `pip install openai python-chess tabulate` (add `flask` when you plan to run the web UI). Run the interactive predictor via `python Oracle_one_move`; supply a Stockfish binary and PGN fragment when prompted. Process entire PGN archives with `python Oracle_pgn_file`, which writes predictions to the configured CSV path. Serve the web interface with `python Oracle_web.py` after installing `flask`. Before opening a pull request, run `python -m black Oracle_one_move Oracle_pgn_file` and `pytest -q`. Enable verbose logging with environment variables such as ORACLE_WEB_LOG_LEVEL=DEBUG or ORACLE_WEB_DEBUG=true when troubleshooting.

## Coding Style & Naming Conventions
Follow PEP 8: 4-space indentation, snake_case identifiers, and descriptive helper names instead of sprawling functions. Keep configuration at the top of each script, but source secrets such as API keys with `os.environ.get` to avoid leaking credentials. Use type hints for new functions where practical, and reserve inline comments for explaining non-obvious heuristics or scoring rules.

## Testing Guidelines
Adopt `pytest` for all new logic. Name test files `test_<feature>.py` and mock external services (OpenAI, Stockfish, filesystem writes) so suites run offline. Store reusable game fragments in `tests/fixtures/` and validate both probability outputs and CSV structure. Aim for at least 80% coverage on touched modules and include failing-game regressions when bugs are fixed.

## Commit & Pull Request Guidelines
Commits should be small, focused, and written in the imperative mood (`Add PGN batch validator`). Reference issue IDs or PGN samples in the body when helpful. Pull requests need: a concise summary, reproduction steps or sample commands, confirmation that formatting and tests ran, and screenshots or snippets when output formats change. Highlight any configuration updates (Stockfish path, environment variables) in a dedicated checklist.

## Security & Configuration Tips
Set `OPENAI_API_KEY` and `STOCKFISH_PATH` via environment variables or a local `.env` excluded from version control. Never commit PGNs containing private data. When sharing logs, redact token usage details and any API responses that might reveal user prompts.
