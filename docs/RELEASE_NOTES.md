# Release Notes

## Unreleased

- Documented the free `mistralai/Mistral-7B-Instruct-v0.2` Hugging Face Inference endpoint as the default Oracle model and explained how to supply an optional access token.
- Updated example environment settings to use `HUGGINGFACEHUB_API_TOKEN`, `HUGGINGFACE_MODEL_ID`, and `STOCKFISH_PATH` instead of the previous provider-specific variables.
- Noted the new `tabulate` dependency, which the CLI uses to format prediction tables.
- Added configurable Elo buckets to `OracleConfig` and surfaced the per-rating win percentages in the CLI and web result views.
