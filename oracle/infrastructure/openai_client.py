import concurrent.futures
import logging
import math
import time
from typing import List, Tuple

import openai

from oracle.domain.models import TokenUsage


logger = logging.getLogger(__name__)


class OpenAISequencePredictor:
    def __init__(self, api_key: str, model: str) -> None:
        if api_key:
            openai.api_key = api_key
        self.model = model
        self.usage = TokenUsage()
        logger.debug("Initialised OpenAISequencePredictor with model=%s", model)

    def reset_usage(self) -> None:
        logger.debug(
            "Resetting token usage (previous input=%s, output=%s)",
            self.usage.input_tokens,
            self.usage.output_tokens,
        )
        self.usage = TokenUsage()

    def get_usage(self) -> TokenUsage:
        logger.debug(
            "Returning usage snapshot (input=%s, output=%s, cost=%.6f)",
            self.usage.input_tokens,
            self.usage.output_tokens,
            self.usage.cost_usd,
        )
        return TokenUsage(
            input_tokens=self.usage.input_tokens,
            output_tokens=self.usage.output_tokens,
            cost_usd=self.usage.cost_usd,
        )

    def _update_usage(self, response) -> None:
        usage = response.get('usage', {})
        input_tokens = usage.get('prompt_tokens', 0)
        output_tokens = usage.get('completion_tokens', 0)
        cost_delta = (input_tokens * 1.50 + output_tokens * 2.00) / 1_000_000
        self.usage.input_tokens += input_tokens
        self.usage.output_tokens += output_tokens
        self.usage.cost_usd += cost_delta
        logger.debug(
            "Updated usage: +%s prompt tokens, +%s completion tokens, +$%.6f",
            input_tokens,
            output_tokens,
            cost_delta,
        )

    def _make_api_call(self, prompt: str, retries: int) -> dict | None:
        attempt = 0
        while attempt < retries:
            try:
                logger.debug(
                    "Calling OpenAI (model=%s, attempt=%s, prompt_length=%s)",
                    self.model,
                    attempt + 1,
                    len(prompt),
                )
                response = openai.Completion.create(
                    engine=self.model,
                    prompt=prompt,
                    max_tokens=1,
                    logprobs=10,
                )
                self._update_usage(response)
                logger.debug("OpenAI call succeeded on attempt %s", attempt + 1)
                return response
            except Exception as exc:  # noqa: BLE001
                attempt += 1
                logger.exception("OpenAI call failed (attempt=%s/%s)", attempt, retries, exc_info=exc)
                time.sleep(1)
        logger.error("OpenAI call exhausted retries=%s", retries)
        return None

    def _is_valid_continuation(self, token: str, partial_sequence: str, legal_moves: List[str]) -> bool:
        potential_sequence = partial_sequence + token
        is_valid = any(move.startswith(potential_sequence) for move in legal_moves)
        if not is_valid:
            logger.debug(
                "Token '%s' invalid for continuation '%s' (legal moves sample=%s)",
                token,
                partial_sequence,
                legal_moves[:5],
            )
        return is_valid

    def get_sequences(
        self,
        prompt: str,
        legal_moves: List[str],
        depth: int,
        retries: int = 3,
        prob_threshold: float = 0.001,
    ) -> List[Tuple[str, float]]:
        logger.debug(
            "Fetching GPT sequences (depth=%s, legal_moves=%s, threshold=%s)",
            depth,
            len(legal_moves),
            prob_threshold,
        )
        sequences: List[Tuple[str, float]] = []

        if depth == 0:
            logger.debug("Depth 0 supplied, returning empty default sequence")
            return [("", 0.0)]

        legal_moves_pool = legal_moves.copy()

        def expand_sequence(
            base_prompt: str,
            seq: str,
            seq_logprob: float,
            working_legal_moves: List[str],
            remaining_depth: int,
            remaining_retries: int,
            threshold: float,
        ) -> None:
            if remaining_depth == 0:
                logger.debug("Reached max recursion depth for sequence '%s'", seq)
                return

            expanded_prompt = f"{base_prompt} {seq}".strip()
            response = self._make_api_call(expanded_prompt, remaining_retries)
            if not response:
                logger.debug("No response expanding sequence '%s'", seq)
                return

            choice = response.choices[0]
            logprobs = choice.get('logprobs')
            if not logprobs:
                logger.debug("Missing log probabilities for sequence '%s'", seq)
                return

            top_logprobs = logprobs.get('top_logprobs')
            if not top_logprobs:
                logger.debug("Missing top log probabilities for sequence '%s'", seq)
                return

            token_probs = top_logprobs[0]
            futures = []
            with concurrent.futures.ThreadPoolExecutor() as executor:
                for next_token, next_logprob in token_probs.items():
                    token = next_token.strip()
                    if not token:
                        continue

                    combined_sequence = seq + token
                    combined_logprob = seq_logprob + next_logprob
                    combined_prob = math.exp(combined_logprob)
                    token_prob = math.exp(next_logprob)

                    if token_prob < threshold or combined_prob < threshold:
                        logger.debug(
                            "Skipping token '%s' due to probability threshold (token=%.6f, combined=%.6f)",
                            token,
                            token_prob,
                            combined_prob,
                        )
                        continue

                    if not self._is_valid_continuation(token, seq, working_legal_moves):
                        continue

                    possible_moves = [move for move in working_legal_moves if move.startswith(combined_sequence)]
                    if len(possible_moves) == 1:
                        complete_move = possible_moves[0]
                        sequences.append((complete_move, combined_logprob))
                        logger.debug("Resolved sequence '%s' -> '%s'", seq, complete_move)
                        working_legal_moves.remove(complete_move)
                        continue

                    if "O-O" in working_legal_moves and "O-O-O" in working_legal_moves and combined_sequence == "O-O":
                        response_after_oo = self._make_api_call(f"{base_prompt} {combined_sequence}".strip(), remaining_retries)
                        if response_after_oo:
                            logprobs_after = response_after_oo.choices[0].get('logprobs')
                            if logprobs_after:
                                top_after = logprobs_after.get('top_logprobs')
                                if top_after:
                                    token_after = top_after[0].get("-O")
                                    if token_after is not None:
                                        combined_logprob_ooo = combined_logprob + token_after
                                        combined_prob_ooo = math.exp(combined_logprob_ooo)
                                        combined_prob_oo = combined_prob - combined_prob_ooo
                                        combined_logprob_oo = (
                                            math.log(combined_prob_oo)
                                            if combined_prob_oo > 0
                                            else float('-inf')
                                        )

                                        logger.debug(
                                            "Castling ambiguity resolved (OO prob=%.6f, OOO prob=%.6f)",
                                            combined_prob,
                                            combined_prob_ooo,
                                        )
                                        if combined_prob_ooo >= threshold:
                                            sequences.append(("O-O-O", combined_logprob_ooo))
                                            if "O-O-O" in working_legal_moves:
                                                working_legal_moves.remove("O-O-O")

                                        if combined_logprob_oo != float('-inf') and combined_prob_oo >= threshold:
                                            sequences.append((combined_sequence, combined_logprob_oo))
                                            if combined_sequence in working_legal_moves:
                                                working_legal_moves.remove(combined_sequence)
                                        continue
                        if combined_prob >= threshold:
                            sequences.append((combined_sequence, combined_logprob))
                            if combined_sequence in working_legal_moves:
                                working_legal_moves.remove(combined_sequence)
                        continue

                    futures.append(
                        executor.submit(
                            expand_sequence,
                            base_prompt,
                            combined_sequence,
                            combined_logprob,
                            working_legal_moves.copy(),
                            remaining_depth - 1,
                            remaining_retries,
                            threshold,
                        )
                    )

            concurrent.futures.wait(futures)

        initial_response = self._make_api_call(prompt, retries)
        if not initial_response:
            logger.warning("Initial OpenAI call failed for prompt size=%s", len(prompt))
            return []

        choice = initial_response.choices[0]
        logprobs = choice.get('logprobs')
        if not logprobs:
            logger.debug("Initial response missing log probabilities")
            return []

        top_logprobs = logprobs.get('top_logprobs')
        if not top_logprobs:
            logger.debug("Initial response missing top log probabilities")
            return []

        initial_sequences: List[Tuple[str, float, str]] = []
        for token, logprob in top_logprobs[0].items():
            token = token.strip()
            if not token:
                continue
            token_prob = math.exp(logprob)
            if token_prob < prob_threshold:
                continue
            if not self._is_valid_continuation(token, "", legal_moves_pool):
                continue
            initial_sequences.append((token, logprob, f"{prompt}{token}"))

        logger.debug("Seeded %s initial sequences for expansion", len(initial_sequences))

        with concurrent.futures.ThreadPoolExecutor() as executor:
            futures = [
                executor.submit(
                    expand_sequence,
                    prompt,
                    token,
                    logprob,
                    legal_moves_pool.copy(),
                    depth - 1,
                    retries,
                    prob_threshold,
                )
                for token, logprob, _ in initial_sequences
            ]
            concurrent.futures.wait(futures)

        if not sequences and prob_threshold > 0.01:
            logger.debug(
                "No sequences above threshold %.6f, retrying with %.6f",
                prob_threshold,
                prob_threshold / 10,
            )
            return self.get_sequences(prompt, legal_moves, depth, retries, prob_threshold / 10)

        logger.debug("Returning %s sequences", len(sequences))
        return sequences


__all__ = ["OpenAISequencePredictor"]
