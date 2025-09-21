import concurrent.futures
import csv
import logging
import math
import os
import re
import signal
import sys
import time

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

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Set your Hugging Face token and model here
HUGGINGFACE_API_TOKEN = os.getenv("HUGGINGFACEHUB_API_TOKEN", "")
HUGGINGFACE_MODEL_ID = "mistralai/Mistral-7B-Instruct-v0.2"

# Set your Stockfish path here
engine_path = ""

# Set your input pgn file path here
pgn_file_path = ".pgn"

# Set your output csv file path here
output_file_path = ".csv"

total_input_tokens = 0
total_output_tokens = 0
best_move_notation = ""

hf_client: InferenceClient | None = None


def _update_usage_metrics(response) -> None:
    global total_input_tokens, total_output_tokens
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

    total_input_tokens += len(prefill or [])
    total_output_tokens += len(tokens or [])


def _extract_token_logprobs(response) -> dict[str, float]:
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

    results: dict[str, float] = {}
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
        results[str(token_text)] = float(logprob)

    return results


def extract_moves_from_pgn(pgn_file_path):
    all_moves = []
    with open(pgn_file_path, encoding="utf-8-sig") as file:
        games = file.read().split("\n\n\n")

    for game in games:
        lines = game.split("\n")
        for line in lines:
            if not line.startswith("["):
                line = re.sub(r"\{[^}]*\}|\([^)]*\)", "", line)
                moves = line.split(" ")
                for move in moves:
                    if (
                        not re.match(r"\d+\.", move)
                        and move != ""
                        and move not in {"1-0", "0-1", "1/2-1/2", "*"}
                    ):
                        all_moves.append(move)
    return all_moves


def process_pgn(pgn_file_path):
    prompts = []
    game_index = 0

    with open(pgn_file_path, encoding="utf-8-sig") as pgn_file:
        while True:
            game = chess.pgn.read_game(pgn_file)
            if game is None:
                break
            game_index += 1

            header = []
            for key in game.headers.keys():  # noqa: SIM118
                if key in [
                    "Event",
                    "Site",
                    "Round",
                    "White",
                    "Black",
                    "WhiteElo",
                    "BlackElo",
                    "TimeControl",
                ]:
                    header.append(f'[{key} "{game.headers[key]}"]')
            header_str = "\n".join(header)

            node = game
            moves = []
            while not node.is_end():
                next_node = node.variation(0)
                moves.append(node.board().san(next_node.move))
                node = next_node

            moves_str = " ".join(moves).strip()
            move_list = moves_str.split(" ")
            move_list = [move for move in move_list if move and not move[0].isdigit()]

            if move_list:
                prompts.append((game_index, 1, f"{header_str}\n\n1."))
                current_moves = "1."
                move_number = 1
                for i in range(len(move_list) - 1):
                    if i % 2 == 0:
                        current_moves += f" {move_list[i]}"
                        prompts.append(
                            (game_index, move_number, f"{header_str}\n\n{current_moves}")
                        )
                    else:
                        current_moves += f" {move_list[i]}"
                        if i + 1 < len(move_list):
                            move_number += 1
                            current_moves += f" {move_number}."
                        prompts.append(
                            (game_index, move_number, f"{header_str}\n\n{current_moves}")
                        )

    logging.debug(f"Number of prompts generated: {len(prompts)}")
    return prompts


def get_legal_moves(board):
    return [board.san(move) for move in board.legal_moves]


def analyze_moves(engine, board, n, time_limit=1.3, depth=20, threads=8, hash_size=512):
    engine.configure({"Threads": threads, "Hash": hash_size})

    try:
        info = engine.analyse(board, chess.engine.Limit(time=time_limit, depth=depth), multipv=n)
    except Exception as e:
        logging.error(f"Engine analysis failed: {e}")
        return []

    evals_with_mate = []
    for i in range(n):
        try:
            move_info = info[i]
            move = board.san(chess.Move.from_uci(move_info["pv"][0].uci()))
            eval_score = move_info["score"].relative

            if eval_score.is_mate():
                eval_score = f"mate:{eval_score.mate()}"
            else:
                eval_score = clamp_score(eval_score.score())
                if board.turn == chess.BLACK:
                    eval_score = -eval_score

            evals_with_mate.append((move, eval_score))
        except Exception as e:
            logging.error(f"Failed to process move {i}: {e}")
            evals_with_mate.append((None, None))

    return evals_with_mate


def clamp_score(score):
    return max(-2000, min(2000, score))


def make_api_call_with_backoff(prompt, retries):
    attempt = 0
    while attempt < retries:
        try:
            if hf_client is None:
                raise RuntimeError("Hugging Face client has not been initialised")
            response = hf_client.text_generation(
                prompt,
                max_new_tokens=1,
                details=True,
                return_full_text=False,
            )
            _update_usage_metrics(response)
            return response
        except (
            InferenceTimeoutError,
            InferenceEndpointError,
            TextGenerationError,
            GenerationError,
            HTTPError,
        ) as e:
            logging.error(f"Inference error: {e}")
            sleep_time = min(60, 2**attempt)
            logging.info("Retrying in %s seconds...", sleep_time)
            time.sleep(sleep_time)
            attempt += 1
        except Exception as e:
            logging.error(f"API call error: {e}")
            time.sleep(1)
            attempt += 1
    return None


def get_best_move_notation(best_win_percentage, new_norm_prob, board_turn, current_win_percentage):
    if (
        board_turn == chess.WHITE
        and best_win_percentage > 20
        and best_win_percentage - current_win_percentage > 5
    ) or (
        board_turn == chess.BLACK
        and best_win_percentage < 80
        and current_win_percentage - best_win_percentage > 5
    ):
        if new_norm_prob < 50:
            return "!!"
        elif 50 <= new_norm_prob <= 80:
            return "!"
        else:
            return ""
    return ""


def find_best_move_index(moves, turn):
    best_eval = min

    if turn == chess.WHITE:
        best_eval = max

    best_move = best_eval(moves, key=lambda x: x[1])
    best_move_idx = moves.index(best_move)
    return best_move_idx, best_move[1]


def get_notation(percentage_loss, is_best_move, new_norm_prob, eval_score, board_turn):
    global best_move_notation

    if is_best_move:
        return best_move_notation

    if percentage_loss == 0:
        if best_move_notation in ["!!", "!"]:
            return "!!" if best_move_notation == "!!" else "!"
        else:
            return ""

    if 0 < percentage_loss <= 0.5:
        if best_move_notation in ["!!", "!"]:
            return "!!" if best_move_notation == "!!" else "!"
        else:
            return ""
    elif 0.5 < percentage_loss <= 2.5:
        if best_move_notation == "!!":
            return "!"
        else:
            return ""
    elif 2.5 < percentage_loss <= 5:
        return ""
    elif 5 < percentage_loss <= 10:
        return "?!"
    elif 10 < percentage_loss <= 20:
        return "?"
    else:
        return "??"


def get_top_sequences(
    prompt,
    legal_moves,
    depth=5,
    retries=3,
    prob_threshold=0.001,
    temperature=None,
    top_p=None,
    top_k=None,
    repetition_penalty=None,
):
    sequences = []

    if depth == 0:
        return [("", 0.0)]

    def is_valid_continuation(token, partial_sequence, legal_moves_list):
        potential_sequence = partial_sequence + token
        return any(legal_move.startswith(potential_sequence) for legal_move in legal_moves_list)

    def make_api_call(prompt_text, retries_left):
        attempt = 0
        while attempt < retries_left:
            try:
                if hf_client is None:
                    raise RuntimeError("Hugging Face client has not been initialised")
                generation_kwargs = {
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

                response = hf_client.text_generation(prompt_text, **generation_kwargs)
                _update_usage_metrics(response)
                return response
            except (
                InferenceTimeoutError,
                InferenceEndpointError,
                TextGenerationError,
                GenerationError,
                HTTPError,
            ) as exc:
                logging.error("Inference error: %s", exc)
                attempt += 1
                time.sleep(1)
            except Exception as exc:  # - broad to preserve script behaviour
                logging.error("API call error: %s", exc)
                attempt += 1
                time.sleep(1)
        return None

    def expand_sequence(
        base_prompt,
        seq,
        seq_logprob,
        legal_moves_list,
        remaining_depth,
        retries_left,
        threshold,
    ):
        if remaining_depth == 0:
            return

        expanded_prompt = base_prompt + " " + seq
        response = make_api_call(expanded_prompt, retries_left)

        if not response:
            return

        top_tokens = _extract_token_logprobs(response)
        if not top_tokens:
            return

        futures = []
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

                if not is_valid_continuation(token_text, seq, legal_moves_list):
                    continue

                possible_moves = [
                    move for move in legal_moves_list if move.startswith(combined_sequence)
                ]
                if len(possible_moves) == 1:
                    complete_sequence = possible_moves[0]
                    sequences.append((complete_sequence, combined_logprob))
                    if complete_sequence in legal_moves_list:
                        legal_moves_list.remove(complete_sequence)
                else:
                    if (
                        "O-O" in legal_moves_list
                        and "O-O-O" in legal_moves_list
                        and combined_sequence == "O-O"
                    ):
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
                                    if "O-O-O" in legal_moves_list:
                                        legal_moves_list.remove("O-O-O")

                                if (
                                    combined_logprob_castling != float("-inf")
                                    and combined_prob_castling >= threshold
                                ):
                                    sequences.append(
                                        (combined_sequence, combined_logprob_castling)
                                    )
                                    if combined_sequence in legal_moves_list:
                                        legal_moves_list.remove(combined_sequence)
                            else:
                                if combined_prob >= threshold:
                                    sequences.append((combined_sequence, combined_logprob))
                                    if combined_sequence in legal_moves_list:
                                        legal_moves_list.remove(combined_sequence)
                    else:
                        futures.append(
                            executor.submit(
                                expand_sequence,
                                base_prompt,
                                combined_sequence,
                                combined_logprob,
                                legal_moves_list,
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

    initial_sequences = []

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
            prompt,
            legal_moves,
            depth,
            retries,
            prob_threshold / 10,
            temperature,
            top_p,
            top_k,
            repetition_penalty,
        )

    return sequences

def calculate_win_percentage(rating, centipawns):
    coefficient = rating * -0.00000274 + 0.00048

    exponent = coefficient * centipawns

    win_percentage = 100 * (0.5 + (0.5 * (2 / (1 + math.exp(exponent)) - 1)))

    return win_percentage


def parse_time_control(time_control):
    phases = time_control.split(":")
    total_time = 0
    average_moves = 40
    increments = []

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


def determine_game_type(time_control):
    if time_control == "-":
        return "Unknown"

    total_time = parse_time_control(time_control)

    if total_time < 180:
        return "Bullet"
    elif total_time < 600:
        return "Blitz"
    elif total_time < 3600:
        return "Rapid"
    else:
        return "Classical"


def process_pgn_and_analyze(
    pgn_file_path,
    engine_path,
    model=HUGGINGFACE_MODEL_ID,
    depth=5,
    prob_threshold=0.001,
    output_file_path="analysis_results.csv",
    default_rating=2000,
    default_game_type="classical",
    token: str | None = HUGGINGFACE_API_TOKEN or None,
):
    all_moves = extract_moves_from_pgn(pgn_file_path)
    global best_move_notation, hf_client
    hf_client = InferenceClient(model=model, token=token)
    prompts = process_pgn(pgn_file_path)

    engine = chess.engine.SimpleEngine.popen_uci(engine_path)
    start_time = time.time()

    def save_result(result):
        with open(output_file_path, "a", newline="") as csvfile:
            fieldnames = [
                "game_index",
                "movenumber",
                "white_or_black",
                "prediction",
                "notation",
                "raw_prob",
                "new_norm_prob",
                "win_percentage",
                "eval_centipawns",
                "eval_with_mate",
                "is_played",
                "best_move_importance",
                "rating",
                "game_type",
            ]
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writerow(result)

    def signal_handler(sig, frame):
        logging.warning("Interrupt signal received. Saving results...")
        engine.quit()
        sys.exit(0)

    signal.signal(signal.SIGINT, signal_handler)

    with open(output_file_path, "w", newline="") as csvfile:
        fieldnames = [
            "game_index",
            "movenumber",
            "white_or_black",
            "prediction",
            "notation",
            "raw_prob",
            "new_norm_prob",
            "win_percentage",
            "eval_centipawns",
            "eval_with_mate",
            "is_played",
            "best_move_importance",
            "rating",
            "game_type",
        ]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()

    try:
        move_index = 0
        current_game_index = None
        current_move_number = 1

        for _, (game_index, move_number, prompt) in enumerate(prompts):
            if game_index != current_game_index:
                current_game_index = game_index
                current_move_number = 1

            logging.info(f"Prompt to language model:\n{prompt}")
            try:
                pgn_content = "\n".join(prompt.split("\n\n")[:-1])
                white_elo = re.search(r'\[WhiteElo\s+"(\d+)"\]', pgn_content)
                black_elo = re.search(r'\[BlackElo\s+"(\d+)"\]', pgn_content)
                time_control_match = re.search(r'\[TimeControl\s+"([^"]+)"\]', pgn_content)

                if time_control_match:
                    time_control = time_control_match.group(1)
                    game_type = determine_game_type(time_control)
                    game_type = game_type.lower()
                else:
                    game_type = default_game_type

                if white_elo and black_elo:
                    try:
                        white_elo = int(white_elo.group(1))
                        black_elo = int(black_elo.group(1))
                    except ValueError:
                        white_elo = black_elo = default_rating
                else:
                    white_elo = black_elo = default_rating

                def adjust_rating(rating, game_type):
                    adjustments = {"bullet": 0, "blitz": 200, "rapid": 700, "classical": 1200}
                    rating += adjustments.get(game_type, 0)
                    rating = max(1000, min(4100, rating))
                    return rating

                white_elo = adjust_rating(white_elo, game_type)
                black_elo = adjust_rating(black_elo, game_type)

                board = chess.Board()

                moves = prompt.split("\n\n")[1].strip().split(" ")
                for move in moves:
                    if re.match(r"\d+\.", move):
                        continue
                    try:
                        board.push_san(move)
                    except ValueError:
                        logging.warning(f"Invalid move detected and skipped: {move}")
                        continue

                rating = white_elo if board.turn == chess.WHITE else black_elo

                legal_moves = get_legal_moves(board)
                logging.info(f"Legal moves before Stockfish: {legal_moves}")

                top_sequences = get_top_sequences(
                    prompt,
                    legal_moves,
                    depth=depth,
                    retries=3,
                    prob_threshold=prob_threshold,
                )

                logging.info(f"Top sequences from the model: {top_sequences}")

                evals_with_mate = analyze_moves(engine, board, len(legal_moves))
                evals = []
                eval_with_mate_dict = {}
                for move, eval_score in evals_with_mate:
                    eval_with_mate_dict[move] = eval_score
                    if isinstance(eval_score, str) and eval_score.startswith("mate:"):
                        mate_value = int(eval_score.split(":")[1])
                        if board.turn == chess.WHITE:
                            eval_score = 10000 if mate_value > 0 else -10000
                        else:
                            eval_score = -10000 if mate_value > 0 else 10000
                    evals.append((move, eval_score))

                best_move_idx, best_eval_value = find_best_move_index(evals, board.turn)

                best_move = evals[best_move_idx][0]

                actual_move = all_moves[move_index]

                move_probabilities = {}
                for seq, logprob in top_sequences:
                    probability = math.exp(logprob) * 100
                    if seq in move_probabilities:
                        move_probabilities[seq] += probability
                    else:
                        move_probabilities[seq] = probability

                if best_move not in move_probabilities:
                    move_probabilities[best_move] = prob_threshold * 100

                total_probability = sum(move_probabilities.values())
                raw_probabilities = {
                    move: (prob / total_probability) * 100
                    for move, prob in move_probabilities.items()
                }
                normalized_moves_initial = raw_probabilities.copy()

                win_percentages_1500 = {
                    move: calculate_win_percentage(1500, eval_score) for move, eval_score in evals
                }
                win_percentages_rating = {
                    move: calculate_win_percentage(rating, eval_score) for move, eval_score in evals
                }

                def find_win_percentages(win_percentages):
                    sorted_percentages = sorted(win_percentages.values())
                    highest = sorted_percentages[-1]
                    lowest = sorted_percentages[0]
                    second_highest = sorted_percentages[-2] if len(sorted_percentages) > 1 else None
                    second_lowest = sorted_percentages[1] if len(sorted_percentages) > 1 else None
                    return highest, lowest, second_highest, second_lowest

                highest_1500, lowest_1500, second_highest_1500, second_lowest_1500 = (
                    find_win_percentages(win_percentages_1500)
                )
                highest_rating, lowest_rating, second_highest_rating, second_lowest_rating = (
                    find_win_percentages(win_percentages_rating)
                )

                diff_high_1500 = (
                    (highest_1500 - second_highest_1500) if second_highest_1500 is not None else 0
                )
                diff_high_rating = (
                    (highest_rating - second_highest_rating)
                    if second_highest_rating is not None
                    else 0
                )
                diff_low_1500 = (
                    (second_lowest_1500 - lowest_1500) if second_lowest_1500 is not None else 0
                )
                diff_low_rating = (
                    (second_lowest_rating - lowest_rating)
                    if second_lowest_rating is not None
                    else 0
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
                    "rapid": (
                        (min(rating, 3700)) / 3700 + (14 * (best_move_importance / 100)) ** 0.5
                    )
                    * (min(rating, 3700))
                    / 3700,
                    "blitz": (
                        (min(rating, 3600)) / 3600 + (6 * (best_move_importance / 100) ** 0.5)
                    )
                    * (min(rating, 3600))
                    / 3600,
                    "bullet": (
                        (min(rating, 3400)) / 3400 + (2 * (best_move_importance / 100) ** 0.5)
                    )
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

                total_probability_modified = sum(normalized_moves_initial.values())
                normalized_moves_best_move_adjusted = {
                    move: (prob / total_probability_modified) * 100
                    for move, prob in normalized_moves_initial.items()
                }

                mate_in_dict = {}
                for move, eval_score in evals_with_mate:
                    if isinstance(eval_score, str) and eval_score.startswith("mate:"):
                        mate_in_dict[move] = abs(int(eval_score.split(":")[1]))

                multiplier = {"classical": 150, "rapid": 500, "blitz": 1000, "bullet": 4000}.get(
                    game_type, 150
                )

                percentage_losses = {}
                for move in normalized_moves_best_move_adjusted:
                    win_percentage_1500 = win_percentages_1500[move]
                    win_percentage_rating = win_percentages_rating[move]

                    if board.turn == chess.WHITE:
                        percentage_loss_1500 = highest_1500 - win_percentage_1500
                        percentage_loss_rating = highest_rating - win_percentage_rating
                    else:
                        percentage_loss_1500 = win_percentages_1500[move] - lowest_1500
                        percentage_loss_rating = win_percentages_rating[move] - lowest_rating

                    percentage_loss = max(percentage_loss_1500, percentage_loss_rating)
                    percentage_losses[move] = percentage_loss

                    mate_in = mate_in_dict.get(move)
                    if mate_in is not None and mate_in > 0:
                        if percentage_losses[move] == 0:
                            normalized_moves_best_move_adjusted[move] *= 1 + (
                                rating / (multiplier * mate_in)
                            )
                        elif percentage_losses[move] > 0:
                            normalized_moves_best_move_adjusted[move] /= 1 + (
                                rating / (multiplier * mate_in)
                            )
                    if percentage_loss > 0:
                        normalized_moves_best_move_adjusted[move] /= 1 + (
                            percentage_loss / ((-19 * rating) / 600 + 131.67)
                        )

                total_probability_modified = sum(normalized_moves_best_move_adjusted.values())
                normalized_moves_final = {
                    move: (prob / total_probability_modified) * 100
                    for move, prob in normalized_moves_best_move_adjusted.items()
                }

                sorted_moves = sorted(
                    normalized_moves_final.items(), key=lambda x: x[1], reverse=True
                )

                if actual_move not in normalized_moves_final:
                    sorted_moves.append((actual_move, 0))
                    raw_probabilities[actual_move] = 0

                win_percentages = {}
                for move, norm_prob in sorted_moves:  # noqa: B007
                    eval_score = next((eval_score for m, eval_score in evals if m == move), None)
                    if eval_score is not None:
                        win_percentages[move] = calculate_win_percentage(rating, eval_score)

                current_win_percentage = sum(
                    win_percentages[move] * norm_prob / 100
                    for move, norm_prob in sorted_moves
                    if move in win_percentages
                )

                best_move_notation = get_best_move_notation(
                    calculate_win_percentage(rating, best_eval_value),
                    normalized_moves_final[best_move],
                    board.turn,
                    current_win_percentage,
                )

                for move, norm_prob in sorted_moves:
                    eval_score = next((eval_score for m, eval_score in evals if m == move), None)
                    if eval_score is None:
                        continue

                    win_percentage = win_percentages.get(move, 0)

                    raw_prob = raw_probabilities[move]
                    is_played = 1 if move == actual_move else 0

                    notation = get_notation(
                        percentage_losses.get(move, 0),
                        move == best_move,
                        norm_prob,
                        eval_score,
                        board.turn,
                    )

                    result = {
                        "game_index": game_index,
                        "movenumber": current_move_number,
                        "white_or_black": "." if (board.turn == chess.WHITE) else "...",
                        "prediction": move,
                        "notation": notation,
                        "raw_prob": raw_prob,
                        "new_norm_prob": norm_prob,
                        "win_percentage": win_percentage,
                        "eval_centipawns": eval_score,
                        "eval_with_mate": eval_with_mate_dict.get(move),
                        "is_played": is_played,
                        "best_move_importance": best_move_importance,
                        "rating": rating,
                        "game_type": game_type,
                    }
                    save_result(result)

                move_index += 1
                if board.turn == chess.BLACK:
                    current_move_number += 1

                if move_index >= len(all_moves):
                    break
            except Exception as e:
                logging.error(
                    f"An error occurred while processing game {game_index}, move {move_number}: {e}"
                )
                continue

    except Exception as e:
        logging.error(f"An error occurred: {e}")
    finally:
        engine.quit()
        end_time = time.time()
        logging.debug(f"Final results saved. Total moves processed: {move_index}")
        logging.debug(f"Total Time taken: {end_time - start_time:.2f} seconds")
        logging.debug(f"Total input tokens: {total_input_tokens}")
        logging.debug(f"Total output tokens: {total_output_tokens}")


if __name__ == "__main__":
    process_pgn_and_analyze(pgn_file_path, engine_path, output_file_path=output_file_path)
    logging.info(f"Results saved to {output_file_path}")
