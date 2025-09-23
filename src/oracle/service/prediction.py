"""Infrastructure adapters and factory for Oracle predictions."""
from __future__ import annotations

import concurrent.futures
import logging
import math
import os
import time
from dataclasses import replace
from typing import Any, Callable

import chess
import chess.engine
from huggingface_hub import InferenceClient
from huggingface_hub.errors import (
    GenerationError,
    HTTPError,
    InferenceEndpointError,
    InferenceTimeoutError,
    TextGenerationError,
)

from oracle.application.ports import MoveAnalyzer, SequenceProvider
from oracle.application.predict_next_moves import PredictNextMoves
from oracle.domain import MovePrediction, OracleConfig, PredictionMetrics, PredictionResult

LOGGER = logging.getLogger(__name__)


def _parse_int_env(var_name: str) -> int | None:
    """Safely parse integer environment variables."""

    raw_value = os.getenv(var_name)
    if raw_value is None:
        return None
    stripped = raw_value.strip()
    if not stripped:
        return None
    try:
        return int(stripped)
    except ValueError:
        LOGGER.warning("Ignoring %s with non-integer value %r", var_name, raw_value)
        return None


def _update_usage_metrics(metrics: PredictionMetrics, response: Any) -> None:
    details = getattr(response, "details", None)
    if details is None and isinstance(response, dict):
        details = response.get("details")
    if details is None:
        return

    prefill = getattr(details, "prefill", None)
    tokens = getattr(details, "tokens", None)
    if prefill is None and isinstance(details, dict):
        prefill = details.get("prefill", [])
        tokens = details.get("tokens", [])

    metrics.input_tokens += len(prefill or [])
    metrics.output_tokens += len(tokens or [])


def _extract_token_logprobs(response: Any) -> dict[str, float]:
    details = getattr(response, "details", None)
    if details is None and isinstance(response, dict):
        details = response.get("details")
    if not details:
        return {}

    tokens = getattr(details, "tokens", None)
    if tokens is None and isinstance(details, dict):
        tokens = details.get("tokens")
    if not tokens:
        return {}

    first_token = tokens[0]
    top_tokens = getattr(first_token, "top_tokens", None)
    if top_tokens is None and isinstance(first_token, dict):
        top_tokens = first_token.get("top_tokens")
    if not top_tokens:
        return {}

    logprob_by_token: dict[str, float] = {}
    for candidate in top_tokens:
        token_text = getattr(candidate, "text", None)
        if token_text is None:
            token_text = getattr(candidate, "token", None)
        if token_text is None and isinstance(candidate, dict):
            token_text = candidate.get("text") or candidate.get("token")
        logprob = getattr(candidate, "logprob", None)
        if logprob is None and isinstance(candidate, dict):
            logprob = candidate.get("logprob")
        if token_text is None or logprob is None:
            continue
        logprob_by_token[str(token_text)] = float(logprob)

    return logprob_by_token


class HuggingFaceSequenceProvider(SequenceProvider):
    """Adapter around the Hugging Face Inference API."""

    def __init__(self, client: Any):
        self._client = client

    @property
    def client(self) -> Any:
        return self._client

    @staticmethod
    def from_config(config: OracleConfig) -> HuggingFaceSequenceProvider:
        client = config.huggingface_client
        if client is None:
            token = config.huggingface_token
            if not token and config.huggingface_token_env_var:
                token = os.getenv(config.huggingface_token_env_var)
            client = InferenceClient(model=config.huggingface_model, token=token)
        return HuggingFaceSequenceProvider(client)

    def get_top_sequences(
        self,
        prompt: str,
        legal_moves: list[str],
        depth: int,
        metrics: PredictionMetrics,
        prob_threshold: float,
        temperature: float | None = None,
        top_p: float | None = None,
        top_k: int | None = None,
        top_n_tokens: int | None = None,
        repetition_penalty: float | None = None,
        retries: int = 3,
    ) -> list[tuple[str, float]]:
        if depth == 0:
            return [("", 0.0)]

        def make_api_call(prompt_text: str, retries_left: int) -> Any:
            attempt = 0
            while attempt < retries_left:
                try:
                    generation_kwargs: dict[str, Any] = {
                        "max_new_tokens": 1,
                        "details": True,
                        "return_full_text": False,
                    }
                    if temperature is not None:
                        generation_kwargs["temperature"] = temperature
                    if top_p is not None:
                        generation_kwargs["top_p"] = top_p
                    if top_k is not None:
                        generation_kwargs["top_k"] = top_k
                    if top_n_tokens is not None and top_n_tokens > 0:
                        generation_kwargs["top_n_tokens"] = top_n_tokens
                    elif top_k is not None and top_k > 0:
                        generation_kwargs["top_n_tokens"] = top_k
                    if repetition_penalty is not None:
                        generation_kwargs["repetition_penalty"] = repetition_penalty

                    response = self._client.text_generation(prompt_text, **generation_kwargs)
                    _update_usage_metrics(metrics, response)
                    return response
                except (
                    InferenceTimeoutError,
                    InferenceEndpointError,
                    TextGenerationError,
                    GenerationError,
                    HTTPError,
                ):
                    attempt += 1
                    time.sleep(1)
                except Exception:
                    attempt += 1
                    time.sleep(1)
            return None

        def is_valid_continuation(token: str, partial_sequence: str, legal: list[str]) -> bool:
            potential_sequence = partial_sequence + token
            return any(legal_move.startswith(potential_sequence) for legal_move in legal)

        sequences: list[tuple[str, float]] = []

        def expand_sequence(
            base_prompt: str,
            seq: str,
            seq_logprob: float,
            legal: list[str],
            remaining_depth: int,
            retries_left: int,
            threshold: float,
        ) -> None:
            if remaining_depth == 0:
                return

            expanded_prompt = base_prompt + " " + seq
            response = make_api_call(expanded_prompt, retries_left)

            if not response:
                return

            top_tokens = _extract_token_logprobs(response)
            if not top_tokens:
                return

            futures: list[concurrent.futures.Future[None]] = []
            with concurrent.futures.ThreadPoolExecutor() as executor:
                for next_token, next_logprob in top_tokens.items():
                    token_text = next_token.strip()
                    if not token_text:
                        continue

                    combined_sequence = seq + token_text
                    combined_logprob = seq_logprob + next_logprob

                    combined_prob = math.exp(combined_logprob)
                    next_token_prob = math.exp(next_logprob)

                    if next_token_prob < threshold or combined_prob < threshold:
                        continue

                    if not is_valid_continuation(token_text, seq, legal):
                        continue

                    possible_moves = [
                        move for move in legal if move.startswith(combined_sequence)
                    ]
                    if len(possible_moves) == 1:
                        complete_sequence = possible_moves[0]
                        sequences.append((complete_sequence, combined_logprob))
                        if complete_sequence in legal:
                            legal.remove(complete_sequence)
                    else:
                        if "O-O" in legal and "O-O-O" in legal and combined_sequence == "O-O":
                            response_after_castling = make_api_call(
                                base_prompt + " " + combined_sequence, retries_left
                            )
                            if response_after_castling:
                                after_tokens = _extract_token_logprobs(response_after_castling)
                                if not after_tokens:
                                    continue
                                next_token_logprob = after_tokens.get("-O")
                                if next_token_logprob is not None:
                                    combined_logprob_tall_castling = (
                                        combined_logprob + next_token_logprob
                                    )
                                    combined_prob_tall_castling = math.exp(
                                        combined_logprob_tall_castling
                                    )
                                    combined_prob_castling = (
                                        combined_prob - combined_prob_tall_castling
                                    )
                                    combined_logprob_castling = (
                                        math.log(combined_prob_castling)
                                        if combined_prob_castling > 0
                                        else float("-inf")
                                    )

                                    if combined_prob_tall_castling >= threshold:
                                        sequences.append(
                                            ("O-O-O", combined_logprob_tall_castling)
                                        )
                                        if "O-O-O" in legal:
                                            legal.remove("O-O-O")

                                    if (
                                        combined_logprob_castling != float("-inf")
                                        and combined_prob_castling >= threshold
                                    ):
                                        sequences.append(
                                            (combined_sequence, combined_logprob_castling)
                                        )
                                        if combined_sequence in legal:
                                            legal.remove(combined_sequence)
                                else:
                                    if combined_prob >= threshold:
                                        sequences.append((combined_sequence, combined_logprob))
                                        if combined_sequence in legal:
                                            legal.remove(combined_sequence)
                        else:
                            futures.append(
                                executor.submit(
                                    expand_sequence,
                                    base_prompt,
                                    combined_sequence,
                                    combined_logprob,
                                    legal,
                                    remaining_depth - 1,
                                    retries_left,
                                    threshold,
                                )
                            )
            concurrent.futures.wait(futures)

        response = make_api_call(prompt, retries_left=retries)
        if not response:
            return []

        top_tokens = _extract_token_logprobs(response)
        if not top_tokens:
            return []

        initial_sequences: list[tuple[str, float]] = []

        for token, logprob in top_tokens.items():
            token_text = token.strip()
            if not token_text:
                continue

            token_prob = math.exp(logprob)
            if token_prob < prob_threshold:
                continue

            if not is_valid_continuation(token_text, "", legal_moves):
                continue

            initial_sequences.append((token_text, logprob))

        with concurrent.futures.ThreadPoolExecutor() as executor:
            futures = [
                executor.submit(
                    expand_sequence,
                    prompt,
                    token,
                    logprob,
                    legal_moves.copy(),
                    depth - 1,
                    retries,
                    prob_threshold,
                )
                for token, logprob in initial_sequences
            ]
            concurrent.futures.wait(futures)

        if not sequences and prob_threshold > 0.01:
            return self.get_top_sequences(
                prompt,
                legal_moves,
                depth,
                metrics,
                prob_threshold / 10,
                temperature,
                top_p,
                top_k,
                top_n_tokens,
                repetition_penalty,
                retries,
            )

        return sequences


def _clamp_score(score: float) -> float:
    return max(-2000.0, min(2000.0, score))


class StockfishMoveAnalyzer(MoveAnalyzer):
    """Adapter around a Stockfish-compatible chess engine."""

    def __init__(
        self,
        stockfish_path: str,
        engine_factory: Callable[[str], chess.engine.SimpleEngine],
    ) -> None:
        self._stockfish_path = stockfish_path
        self._engine_factory = engine_factory

    @staticmethod
    def from_config(config: OracleConfig) -> StockfishMoveAnalyzer:
        factory = config.engine_factory or chess.engine.SimpleEngine.popen_uci
        return StockfishMoveAnalyzer(config.stockfish_path, factory)

    def analyze(
        self,
        board: chess.Board,
        num_moves: int,
        time_limit: float,
        depth: int,
        threads: int,
        hash_size: int,
    ) -> list[tuple[str, float | str, list[str]]]:
        engine = self._engine_factory(self._stockfish_path)
        try:
            engine.configure({"Threads": threads, "Hash": hash_size})

            info = engine.analyse(
                board,
                chess.engine.Limit(time=time_limit, depth=depth),
                multipv=num_moves,
            )
            evals: list[tuple[str, float | str, list[str]]] = []
            for i in range(min(num_moves, len(info))):
                move_info = info[i]
                pv_moves = move_info.get("pv") or []
                move = board.san(chess.Move.from_uci(pv_moves[0].uci())) if pv_moves else ""
                eval_score = move_info["score"].relative

                if eval_score.is_mate():
                    eval_value: float | str = f"mate:{eval_score.mate()}"
                else:
                    score_value = _clamp_score(eval_score.score())
                    if board.turn == chess.BLACK:
                        score_value = -score_value
                    eval_value = score_value

                principal_variation: list[str] = []
                if pv_moves:
                    variation_board = board.copy()
                    for pv_move in pv_moves:
                        try:
                            san_move = variation_board.san(pv_move)
                        except ValueError:
                            san_move = pv_move.uci()
                        principal_variation.append(san_move)
                        variation_board.push(pv_move)

                evals.append((move, eval_value, principal_variation))
            return evals
        finally:
            try:
                engine.quit()
            except Exception:  # pragma: no cover - best effort cleanup
                LOGGER.exception("Failed to close Stockfish engine")


def _get_client(config: OracleConfig) -> Any:
    """Backward compatible helper exposing the underlying Hugging Face client."""

    return HuggingFaceSequenceProvider.from_config(config).client


def get_top_sequences(
    client: Any,
    prompt: str,
    legal_moves: list[str],
    depth: int,
    metrics: PredictionMetrics,
    retries: int = 3,
    prob_threshold: float = 0.001,
    temperature: float | None = None,
    top_p: float | None = None,
    top_k: int | None = None,
    top_n_tokens: int | None = None,
    repetition_penalty: float | None = None,
) -> list[tuple[str, float]]:
    """Compatibility wrapper delegating to the sequence provider adapter."""

    provider = HuggingFaceSequenceProvider(client)
    return provider.get_top_sequences(
        prompt,
        legal_moves,
        depth,
        metrics,
        prob_threshold=prob_threshold,
        temperature=temperature,
        top_p=top_p,
        top_k=top_k,
        top_n_tokens=top_n_tokens,
        repetition_penalty=repetition_penalty,
        retries=retries,
    )


def get_legal_moves(board: chess.Board) -> list[str]:
    """Expose SAN legal moves for compatibility with legacy scripts."""

    return [board.san(move) for move in board.legal_moves]


def build_predict_next_moves_use_case(
    config: OracleConfig,
    *,
    stockfish_path: str,
    huggingface_model: str | None = None,
    huggingface_token: str | None = None,
    huggingface_client: Any | None = None,
    engine_factory: Callable[[str], chess.engine.SimpleEngine] | None = None,
    sequence_provider: SequenceProvider | None = None,
    move_analyzer: MoveAnalyzer | None = None,
) -> PredictNextMoves:
    """Create the prediction use case while wiring the infrastructure adapters."""

    resolved_model = huggingface_model or config.huggingface_model
    resolved_token = (
        huggingface_token if huggingface_token is not None else config.huggingface_token
    )
    resolved_client = (
        huggingface_client if huggingface_client is not None else config.huggingface_client
    )
    resolved_factory = engine_factory if engine_factory is not None else config.engine_factory

    env_top_k = _parse_int_env("HUGGINGFACE_TOP_K")
    env_top_n_tokens = _parse_int_env("HUGGINGFACE_TOP_N_TOKENS")

    resolved_top_k = config.top_k if config.top_k is not None else env_top_k
    if resolved_top_k is not None and resolved_top_k <= 0:
        LOGGER.warning("Ignoring non-positive top_k value: %s", resolved_top_k)
        resolved_top_k = None

    resolved_top_n_tokens = (
        config.top_n_tokens
        if config.top_n_tokens is not None
        else (env_top_n_tokens if env_top_n_tokens is not None else resolved_top_k)
    )
    if resolved_top_n_tokens is not None and resolved_top_n_tokens <= 0:
        LOGGER.warning(
            "Ignoring non-positive top_n_tokens value: %s", resolved_top_n_tokens
        )
        resolved_top_n_tokens = None

    full_config = replace(
        config,
        stockfish_path=stockfish_path,
        huggingface_model=resolved_model,
        huggingface_token=resolved_token,
        huggingface_client=resolved_client,
        engine_factory=resolved_factory,
        top_k=resolved_top_k,
        top_n_tokens=resolved_top_n_tokens,
    )

    composed_sequence_provider = sequence_provider or HuggingFaceSequenceProvider.from_config(
        full_config
    )
    composed_move_analyzer = move_analyzer or StockfishMoveAnalyzer.from_config(full_config)

    return PredictNextMoves(
        sequence_provider=composed_sequence_provider,
        move_analyzer=composed_move_analyzer,
        config=full_config,
    )


def create_prediction_service(config: OracleConfig) -> PredictNextMoves:
    """Compose the infrastructure adapters with the prediction use case."""

    return build_predict_next_moves_use_case(
        config,
        stockfish_path=config.stockfish_path,
        huggingface_model=config.huggingface_model,
        huggingface_token=config.huggingface_token,
        huggingface_client=config.huggingface_client,
        engine_factory=config.engine_factory,
    )


def predict_next_moves(pgn: str, config: OracleConfig) -> PredictionResult:
    """Convenience wrapper around the composed prediction service."""

    service = create_prediction_service(config)
    return service.execute(pgn)


__all__ = [
    "HuggingFaceSequenceProvider",
    "MovePrediction",
    "OracleConfig",
    "PredictionMetrics",
    "PredictionResult",
    "StockfishMoveAnalyzer",
    "_get_client",
    "build_predict_next_moves_use_case",
    "create_prediction_service",
    "get_legal_moves",
    "get_top_sequences",
    "predict_next_moves",
]
