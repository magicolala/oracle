"""Prediction helpers for Oracle."""
from __future__ import annotations

import concurrent.futures
import io
import logging
import math
import os
import re
import time
from dataclasses import dataclass, field
from typing import Any, Callable, Iterable, Sequence

import chess
import chess.engine
import chess.pgn
from huggingface_hub import InferenceClient
from huggingface_hub.errors import (
    GenerationError,
    HTTPError,
    InferenceEndpointError,
    InferenceTimeoutError,
    TextGenerationError,
)


@dataclass
class OracleConfig:
    """Configuration required to evaluate and predict chess moves."""

    stockfish_path: str
    huggingface_model: str = "mistralai/Mistral-7B-Instruct-v0.2"
    huggingface_token: str | None = None
    huggingface_token_env_var: str | None = "HUGGINGFACEHUB_API_TOKEN"
    temperature: float | None = 0.7
    top_p: float | None = None
    top_k: int | None = None
    repetition_penalty: float | None = None
    depth: int = 5
    prob_threshold: float = 0.001
    analysis_time_limit: float = 1.3
    analysis_depth: int = 20
    analysis_threads: int = 8
    analysis_hash_size: int = 512
    default_white_elo: int = 1500
    default_black_elo: int = 1500
    default_game_type: str = "classical"
    huggingface_client: Any | None = None
    engine_factory: Callable[[str], chess.engine.SimpleEngine] | None = None


@dataclass
class PredictionMetrics:
    """Book-keeping for language model usage statistics."""

    input_tokens: int = 0
    output_tokens: int = 0
    cost: float = 0.0


@dataclass
class MovePrediction:
    """Final prediction for a single chess move."""

    move: str
    likelihood: float
    win_percentage: float
    notation: str
    is_best_move: bool


@dataclass
class PredictionResult:
    """Structured predictions returned by :func:`predict_next_moves`."""

    moves: list[MovePrediction]
    current_win_percentage: float
    metrics: PredictionMetrics = field(default_factory=PredictionMetrics)


def clean_pgn(pgn: str) -> str:
    """Normalise a PGN snippet into a single-line moves string."""

    lines = pgn.strip().split("\n")
    cleaned_lines: list[str] = []
    headers: list[str] = []
    moves: list[str] = []
    header_present = False
    moves_started = False

    required_headers = [
        "[Event ",
        "[Site ",
        "[Round ",
        "[White ",
        "[Black ",
        "[WhiteElo ",
        "[BlackElo ",
        "[TimeControl ",
    ]
    for line in lines:
        if line.startswith("["):
            if any(line.startswith(header) for header in required_headers):
                headers.append(line.strip())
                header_present = True
        else:
            if line.strip():
                moves_started = True
            if moves_started:
                moves.append(line.strip())

    if not header_present:
        default_header = ['[White "?"]', '[Black "?"]', '[WhiteElo "?"]', '[BlackElo "?"]']
        headers = default_header

    moves_str = " ".join(moves)

    if moves_str.endswith(("1-0", "0-1", "1/2-1/2", "*")):
        moves_str = moves_str.rsplit(" ", 1)[0]

    moves_str = re.sub(r"\s?\{[^}]*\}", "", moves_str)
    moves_str = re.sub(r"\s?\$\d{1,2}", "", moves_str)
    moves_str = re.sub(r"\s?\d+\.\.\.", "", moves_str)
    moves_str = re.sub(r"[?!]", "", moves_str)

    while re.search(r"\([^()]*\)", moves_str):
        moves_str = re.sub(r"\([^()]*\)", "", moves_str)

    moves_str = re.sub(r"\s+", " ", moves_str).strip()
    if moves_str and moves_str[-1] != ".":
        last_space_index = moves_str.rfind(" ")

        if last_space_index > 0 and moves_str[last_space_index - 1] == ".":
            pass
        else:
            last_dot_index = moves_str.rfind(".")

            move_number_start = moves_str.rfind(" ", 0, last_dot_index) + 1
            move_number = int(moves_str[move_number_start:last_dot_index]) + 1
            moves_str += f" {move_number}."

    moves = moves_str.split(" ") if moves_str else []

    cleaned_lines = [*headers, "", " ".join(moves)]

    result = "\n".join(cleaned_lines)
    return result


def get_legal_moves(board: chess.Board) -> list[str]:
    return [board.san(move) for move in board.legal_moves]


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
    repetition_penalty: float | None = None,
) -> list[tuple[str, float]]:
    sequences: list[tuple[str, float]] = []

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
                if repetition_penalty is not None:
                    generation_kwargs["repetition_penalty"] = repetition_penalty

                response = client.text_generation(prompt_text, **generation_kwargs)
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

    def is_valid_continuation(token: str, partial_sequence: str, legal: Iterable[str]) -> bool:
        potential_sequence = partial_sequence + token
        return any(legal_move.startswith(potential_sequence) for legal_move in legal)

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

    response = make_api_call(prompt, retries)
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
        return get_top_sequences(
            client,
            prompt,
            legal_moves,
            depth,
            metrics,
            retries,
            prob_threshold / 10,
            temperature,
            top_p,
            top_k,
            repetition_penalty,
        )

    return sequences


def clamp_score(score: float) -> float:
    return max(-2000.0, min(2000.0, score))


def calculate_win_percentage(rating: int, centipawns: float) -> float:
    coefficient = rating * -0.00000274 + 0.00048
    exponent = coefficient * centipawns
    win_percentage = 100 * (0.5 + (0.5 * (2 / (1 + math.exp(exponent)) - 1)))
    return win_percentage


def analyze_moves(
    engine: chess.engine.SimpleEngine,
    board: chess.Board,
    n: int,
    time_limit: float = 1.3,
    depth: int = 20,
    threads: int = 8,
    hash_size: int = 512,
) -> list[tuple[str, float | str]]:
    engine.configure({"Threads": threads, "Hash": hash_size})

    info = engine.analyse(
        board,
        chess.engine.Limit(time=time_limit, depth=depth),
        multipv=n,
    )
    evals = []
    for i in range(min(n, len(info))):
        move_info = info[i]
        move = board.san(chess.Move.from_uci(move_info["pv"][0].uci()))
        eval_score = move_info["score"].relative

        if eval_score.is_mate():
            eval_value: float | str = f"mate:{eval_score.mate()}"
        else:
            score_value = clamp_score(eval_score.score())
            if board.turn == chess.BLACK:
                score_value = -score_value
            eval_value = score_value

        evals.append((move, eval_value))
    return evals


def get_best_move_notation(
    best_win_percentage: float,
    new_norm_prob: float,
    board_turn: bool,
    current_win_percentage: float,
) -> str:
    if (
        board_turn == chess.WHITE
        and best_win_percentage > 20
        and best_win_percentage - current_win_percentage > 5
    ) or (
        board_turn == chess.BLACK
        and best_win_percentage < 80
        and current_win_percentage - best_win_percentage > 5
    ):
        if new_norm_prob < 40:
            return "!!"
        if 40 <= new_norm_prob <= 80:
            return "!"
    return ""


def get_color_and_notation(
    percentage_loss: float,
    is_best_move: bool,
    best_move_notation: str,
) -> tuple[str, str]:
    if is_best_move:
        return "\033[96m", best_move_notation

    if percentage_loss == 0:
        if best_move_notation in ["!!", "!"]:
            return "\033[96m", "!!" if best_move_notation == "!!" else "!"
        return "\033[96m", ""

    if 0 < percentage_loss <= 0.5:
        if best_move_notation in ["!!", "!"]:
            return "\033[92m", "!!" if best_move_notation == "!!" else "!"
        return "\033[92m", ""
    if 0.5 < percentage_loss <= 2.5:
        if best_move_notation == "!!":
            return "\033[92m", "!"
        return "\033[92m", ""
    if 2.5 < percentage_loss <= 5:
        return "\033[92m", ""
    if 5 < percentage_loss <= 10:
        return "\033[93m", "?!"
    if 10 < percentage_loss <= 20:
        return "\033[33m", "?"
    return "\033[91m", "??"


def highlight_move(move: str, color: str) -> str:
    color_end = "\033[0m"
    return f"{color}{move}{color_end}"


def find_best_move_index(moves: Sequence[tuple[str, float]], turn: bool) -> tuple[int, float]:
    best_eval = min
    if turn == chess.WHITE:
        best_eval = max
    best_move = best_eval(moves, key=lambda x: x[1])
    best_move_idx = moves.index(best_move)
    return best_move_idx, best_move[1]


def parse_time_control(time_control: str) -> int:
    phases = time_control.split(":")
    total_time = 0
    average_moves = 40
    increments: list[int] = []

    for phase in phases:
        if "+" in phase:
            base, increment = phase.split("+")
            increments.append(int(increment))
        else:
            increments.append(0)

    for i, phase in enumerate(phases):
        if "/" in phase:
            moves, base_increment = phase.split("/")
            base_time = int(base_increment.split("+")[0])
            moves = int(moves)
            total_time += base_time + (moves * increments[i])
        else:
            base_time = int(phase.split("+")[0])
            if i == len(phases) - 1:
                total_time += base_time + (average_moves * increments[i])
            else:
                total_time += base_time

    return total_time


def determine_game_type(time_control: str) -> str:
    if time_control == "-":
        return "Unknown"

    total_time = parse_time_control(time_control)

    if total_time < 180:
        return "bullet"
    if total_time < 600:
        return "blitz"
    if total_time < 3600:
        return "rapid"
    return "classical"


def adjust_rating(rating: int, game_type: str) -> int:
    adjustments = {"bullet": 0, "blitz": 200, "rapid": 700, "classical": 1200}
    rating += adjustments.get(game_type, 0)
    rating = max(1000, min(4100, rating))
    return rating


def _get_client(config: OracleConfig) -> Any:
    if config.huggingface_client is not None:
        return config.huggingface_client

    token = config.huggingface_token
    if not token and config.huggingface_token_env_var:
        token = os.getenv(config.huggingface_token_env_var)

    return InferenceClient(model=config.huggingface_model, token=token)


def predict_next_moves(pgn: str, config: OracleConfig) -> PredictionResult:
    metrics = PredictionMetrics()

    cleaned_pgn = clean_pgn(pgn)
    prompt = cleaned_pgn.strip()

    game = chess.pgn.read_game(io.StringIO(cleaned_pgn))
    if game is None:
        raise ValueError("Unable to parse PGN content")

    board = game.board()
    for move in game.mainline_moves():
        board.push(move)

    white_elo = game.headers.get("WhiteElo")
    black_elo = game.headers.get("BlackElo")
    white_elo_val = int(white_elo) if white_elo and white_elo.isdigit() else config.default_white_elo
    black_elo_val = int(black_elo) if black_elo and black_elo.isdigit() else config.default_black_elo

    time_control = game.headers.get("TimeControl")
    if time_control:
        game_type = determine_game_type(time_control)
        if game_type == "Unknown":
            game_type = config.default_game_type
    else:
        game_type = config.default_game_type

    white_elo_val = adjust_rating(white_elo_val, game_type)
    black_elo_val = adjust_rating(black_elo_val, game_type)

    rating = white_elo_val if board.turn == chess.WHITE else black_elo_val
    high_rating = max(white_elo_val, black_elo_val)

    legal_moves = get_legal_moves(board)
    if not legal_moves:
        return PredictionResult(moves=[], current_win_percentage=0.0, metrics=metrics)

    n = len(legal_moves)

    client = _get_client(config)
    engine_factory = config.engine_factory or chess.engine.SimpleEngine.popen_uci
    engine = engine_factory(config.stockfish_path)

    try:
        with concurrent.futures.ThreadPoolExecutor() as executor:
            future_analyze_moves = executor.submit(
                analyze_moves,
                engine,
                board,
                n,
                config.analysis_time_limit,
                config.analysis_depth,
                config.analysis_threads,
                config.analysis_hash_size,
            )
            future_top_sequences = executor.submit(
                get_top_sequences,
                client,
                prompt,
                legal_moves.copy(),
                config.depth,
                metrics,
                retries=3,
                prob_threshold=config.prob_threshold,
                temperature=config.temperature,
                top_p=config.top_p,
                top_k=config.top_k,
                repetition_penalty=config.repetition_penalty,
            )

            top_sequences = future_top_sequences.result()
            all_evals_with_mate = future_analyze_moves.result()
    finally:
        try:
            engine.quit()
        except Exception:
            logging.getLogger(__name__).exception("Failed to close Stockfish engine")

    all_evals: list[tuple[str, float]] = []
    for move, eval_score in all_evals_with_mate:
        if isinstance(eval_score, str) and eval_score.startswith("mate:"):
            mate_value = int(eval_score.split(":")[1])
            if board.turn == chess.WHITE:
                numeric_eval = 10000 if mate_value > 0 else -10000
            else:
                numeric_eval = -10000 if mate_value > 0 else 10000
            all_evals.append((move, numeric_eval))
        else:
            all_evals.append((move, float(eval_score)))

    move_probabilities: dict[str, float] = {}
    for seq, logprob in top_sequences:
        probability = math.exp(logprob) * 100
        move_probabilities[seq] = move_probabilities.get(seq, 0.0) + probability

    if not all_evals:
        return PredictionResult(moves=[], current_win_percentage=0.0, metrics=metrics)

    best_move_idx, best_eval_value = find_best_move_index(all_evals, board.turn)
    best_move = all_evals[best_move_idx][0]

    if best_move not in move_probabilities:
        move_probabilities[best_move] = config.prob_threshold * 100

    total_probability = sum(move_probabilities.values()) or 1.0
    normalized_moves_initial = {
        move: (prob / total_probability) * 100 for move, prob in move_probabilities.items()
    }

    win_percentages_1500 = {
        move: calculate_win_percentage(1500, eval_score) for move, eval_score in all_evals
    }
    win_percentages_rating = {
        move: calculate_win_percentage(rating, eval_score) for move, eval_score in all_evals
    }

    sorted_percentages_1500 = sorted(win_percentages_1500.values())
    sorted_percentages_rating = sorted(win_percentages_rating.values())

    highest_1500 = sorted_percentages_1500[-1]
    lowest_1500 = sorted_percentages_1500[0]
    second_highest_1500 = (
        sorted_percentages_1500[-2] if len(sorted_percentages_1500) > 1 else None
    )
    second_lowest_1500 = (
        sorted_percentages_1500[1] if len(sorted_percentages_1500) > 1 else None
    )

    highest_rating = sorted_percentages_rating[-1]
    lowest_rating = sorted_percentages_rating[0]
    second_highest_rating = (
        sorted_percentages_rating[-2] if len(sorted_percentages_rating) > 1 else None
    )
    second_lowest_rating = (
        sorted_percentages_rating[1] if len(sorted_percentages_rating) > 1 else None
    )

    diff_high_1500 = (
        (highest_1500 - second_highest_1500) if second_highest_1500 is not None else 0
    )
    diff_high_rating = (
        (highest_rating - second_highest_rating) if second_highest_rating is not None else 0
    )
    diff_low_1500 = (
        (second_lowest_1500 - lowest_1500) if second_lowest_1500 is not None else 0
    )
    diff_low_rating = (
        (second_lowest_rating - lowest_rating) if second_lowest_rating is not None else 0
    )

    if board.turn == chess.WHITE:
        best_move_importance = max(diff_high_1500, diff_high_rating)
    else:
        best_move_importance = max(diff_low_1500, diff_low_rating)

    intercept_best_move = {
        "classical": (
            ((min(rating, 4100)) / 4100) + (20 * (best_move_importance / 100) ** 0.5)
        )
        * (min(rating, 4100))
        / 4100,
        "rapid": ((min(rating, 3700)) / 3700 + (14 * (best_move_importance / 100)) ** 0.5)
        * (min(rating, 3700))
        / 3700,
        "blitz": ((min(rating, 3600)) / 3600 + (6 * (best_move_importance / 100) ** 0.5))
        * (min(rating, 3600))
        / 3600,
        "bullet": ((min(rating, 3400)) / 3400 + (2 * (best_move_importance / 100) ** 0.5))
        * (min(rating, 3400))
        / 3400,
    }.get(
        game_type,
        (((min(rating, 4100)) / 4100) + (20 * (best_move_importance / 100) ** 0.5))
        * (min(rating, 4100))
        / 4100,
    )

    slope_best_move = (100 - intercept_best_move) / 100

    normalized_moves_initial[best_move] = (
        intercept_best_move + slope_best_move * normalized_moves_initial[best_move]
    )

    total_probability = sum(normalized_moves_initial.values()) or 1.0
    normalized_moves_best_adjusted = {
        move: (prob / total_probability) * 100 for move, prob in normalized_moves_initial.items()
    }

    mate_in_dict: dict[str, int] = {}
    for move, eval_score in all_evals_with_mate:
        if isinstance(eval_score, str) and eval_score.startswith("mate:"):
            mate_in_dict[move] = abs(int(eval_score.split(":")[1]))

    multiplier = {"classical": 150, "rapid": 500, "blitz": 1000, "bullet": 4000}.get(
        game_type, 150
    )

    percentage_losses: dict[str, float] = {}
    for move in normalized_moves_best_adjusted:
        win_percentage_1500 = win_percentages_1500.get(move, 0.0)
        win_percentage_rating = win_percentages_rating.get(move, 0.0)

        if board.turn == chess.WHITE:
            percentage_loss_1500 = highest_1500 - win_percentage_1500
            percentage_loss_rating = highest_rating - win_percentage_rating
        else:
            percentage_loss_1500 = win_percentage_1500 - lowest_1500
            percentage_loss_rating = win_percentage_rating - lowest_rating

        percentage_loss = max(percentage_loss_1500, percentage_loss_rating)
        percentage_losses[move] = percentage_loss

        elo = white_elo_val if board.turn == chess.WHITE else black_elo_val

        mate_in = mate_in_dict.get(move)
        if mate_in is not None and mate_in > 0:
            if percentage_loss == 0:
                normalized_moves_best_adjusted[move] *= 1 + (elo / (multiplier * mate_in))
            else:
                normalized_moves_best_adjusted[move] /= 1 + (elo / (multiplier * mate_in))
        if percentage_loss > 0:
            normalized_moves_best_adjusted[move] /= 1 + (
                percentage_loss / ((-19 * elo) / 600 + 131.67)
            )

    total_probability_modified = sum(normalized_moves_best_adjusted.values()) or 1.0
    normalized_moves_final = {
        move: (prob / total_probability_modified) * 100
        for move, prob in normalized_moves_best_adjusted.items()
    }

    sorted_moves = sorted(normalized_moves_final.items(), key=lambda x: x[1], reverse=True)

    valid_moves: list[tuple[str, float, float]] = []

    for move, norm_prob in sorted_moves:
        eval_score = next((eval_score for m, eval_score in all_evals if m == move), None)
        if eval_score is None:
            continue
        valid_moves.append((move, norm_prob, eval_score))

    valid_total_probability = sum(prob for move, prob, eval_score in valid_moves) or 1.0
    new_normalized_moves: list[tuple[str, float, float, float]] = [
        (move, prob, (prob / valid_total_probability) * 100, eval_score)
        for move, prob, eval_score in valid_moves
    ]

    win_percentages: dict[str, float] = {}
    current_win_percentage = 0.0
    for move, _, new_norm_prob, eval_score in new_normalized_moves:
        win_percentage = calculate_win_percentage(high_rating, eval_score)
        win_percentages[move] = win_percentage
        current_win_percentage += win_percentage * new_norm_prob / 100

    best_move_probability = next(
        (new_norm_prob for move, _, new_norm_prob, _ in new_normalized_moves if move == best_move),
        normalized_moves_final.get(best_move, 0.0),
    )
    best_win_percentage = calculate_win_percentage(rating, best_eval_value)
    best_move_notation = get_best_move_notation(
        best_win_percentage,
        best_move_probability,
        board.turn,
        current_win_percentage,
    )

    final_moves: list[MovePrediction] = []
    for move, _, new_norm_prob, _eval_score in new_normalized_moves:
        win_percentage = win_percentages[move]
        percentage_loss = percentage_losses.get(move, 0.0)
        is_best_move = move == best_move
        _color, notation = get_color_and_notation(
            percentage_loss,
            is_best_move,
            best_move_notation,
        )
        final_moves.append(
            MovePrediction(
                move=move,
                likelihood=new_norm_prob,
                win_percentage=win_percentage,
                notation=notation,
                is_best_move=is_best_move,
            )
        )

    return PredictionResult(
        moves=final_moves,
        current_win_percentage=current_win_percentage,
        metrics=metrics,
    )
