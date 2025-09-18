# Oracle Contribution Guide

## Scope
These guidelines apply to the entire repository.

## Project overview
- Core chess helpers live in [`src/oracle/core`](src/oracle/core). `_chess.py` exposes utilities such as `get_legal_moves` and `uci_to_san`, while `pgn.py` focuses on PGN parsing helpers that build on those primitives.
- [`oracle_one_move.py`](oracle_one_move.py) and [`oracle_pgn_file.py`](oracle_pgn_file.py) are interactive scripts that call the OpenAI API and Stockfish. Users must set their own API key, Stockfish binary path, and (for the PGN batch script) input/output file locations before running them.
- Consult [`README.md`](README.md) for feature explanations, screenshots, and usage instructions before adding new behaviour.

## Environment setup
- The project targets Python 3.12 and is managed with Poetry. Install dependencies with `poetry install` to fetch runtime packages (`openai`, `chess`, `python-dotenv`) and development tools (`ruff`, `pytest`).
- Pytest automatically adds `src/` to `PYTHONPATH` via the Poetry configuration, so modules under `src/oracle` can be imported directly in tests.

## Quality checks
Run these commands and ensure they pass before committing changes:
- `poetry run ruff check . --fix` – enforces the configured style (line length 100, with rule sets such as bugbear, pep8-naming, simplify, tidy-imports, etc.).
- `poetry run pytest` – keeps the PGN and chess helper regression suite green.

## Coding guidelines
- Follow the existing convention of typed function signatures and concise docstrings when touching the core helpers.
- Reuse shared utilities like `uci_to_san` to keep board state updates consistent during move conversions and PGN processing.
- Place new unit tests under `tests/units/...` and extend the PGN fixtures via `tests.conftest.get_list_pgn` when additional scenarios are required.

## Operational cautions
- Never commit real API keys, Stockfish engine paths, or other secrets. The placeholders at the top of the entry-point scripts are meant for local configuration only.
