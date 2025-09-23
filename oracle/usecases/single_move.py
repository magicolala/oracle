import concurrent.futures
import logging
import math
import time
from typing import Dict, List, Optional

import chess

from oracle.domain.models import GameContext, MovePrediction, PredictionReport
from oracle.infrastructure.openai_client import OpenAISequencePredictor
from oracle.infrastructure.stockfish_engine import StockfishEngine
from oracle.services.evaluation import adjust_rating, calculate_win_percentage
from oracle.services.notation import compute_best_move_notation
from oracle.services.pgn import clean_pgn, read_game
from oracle.services.reporting import get_color_and_notation


logger = logging.getLogger(__name__)


class SingleMovePredictor:
    def __init__(
        self,
        sequence_predictor: OpenAISequencePredictor,
        stockfish: StockfishEngine,
    ) -> None:
        self.sequence_predictor = sequence_predictor
        self.stockfish = stockfish
        logger.debug("SingleMovePredictor initialised")

    def predict(
        self,
        context: GameContext,
        depth: int = 5,
        prob_threshold: float = 0.001,
        required_moves: Optional[List[str]] | None = None,
    ) -> PredictionReport:
        start_time = time.time()
        logger.debug(
            "Starting prediction (depth=%s, threshold=%s, game_type=%s, white_elo=%s, black_elo=%s)",
            depth,
            prob_threshold,
            context.game_type,
            context.white_elo,
            context.black_elo,
        )

        cleaned_pgn = clean_pgn(context.pgn)
        prompt = cleaned_pgn.strip()
        logger.debug("Cleaned PGN length=%s characters", len(prompt))

        game = read_game(cleaned_pgn)
        board = game.board()

        adjusted_white = adjust_rating(context.white_elo, context.game_type)
        adjusted_black = adjust_rating(context.black_elo, context.game_type)
        rating = adjusted_white if board.turn == chess.WHITE else adjusted_black
        high_rating = max(adjusted_white, adjusted_black)
        logger.debug("Adjusted ratings -> white=%s black=%s (active=%s)", adjusted_white, adjusted_black, rating)

        node = game
        while not node.is_end():
            next_node = node.variation(0)
            board.push(next_node.move)
            node = next_node

        legal_moves = [board.san(move) for move in board.legal_moves]
        logger.debug("Found %s legal moves from final position", len(legal_moves))
        if not legal_moves:
            logger.warning("No legal moves after PGN parsing, aborting")
            return PredictionReport(elapsed_seconds=time.time() - start_time)

        multipv = len(legal_moves)
        self.sequence_predictor.reset_usage()

        with concurrent.futures.ThreadPoolExecutor() as executor:
            future_evals = executor.submit(
                self.stockfish.analyse_moves,
                board.copy(),
                multipv,
            )
            future_sequences = executor.submit(
                self.sequence_predictor.get_sequences,
                prompt,
                legal_moves.copy(),
                depth,
                3,
                prob_threshold,
            )

        top_sequences = future_sequences.result()
        evals_with_mate = future_evals.result()
        logger.debug(
            "Received %s sequences and %s Stockfish eval entries",
            len(top_sequences),
            len(evals_with_mate) if evals_with_mate else 0,
        )

        if not evals_with_mate:
            logger.warning("Stockfish returned no evaluations")
            return PredictionReport(elapsed_seconds=time.time() - start_time)

        all_evals: List[tuple[str, float]] = []
        mate_in_dict: Dict[str, int] = {}
        eval_with_mate_dict: Dict[str, str | float] = {}
        for move, eval_score in evals_with_mate:
            if move is None:
                continue
            eval_with_mate_dict[move] = eval_score
            if isinstance(eval_score, str) and eval_score.startswith('mate:'):
                mate_value = int(eval_score.split(':')[1])
                mate_in_dict[move] = abs(mate_value)
                eval_value = 10000 if (mate_value > 0) == (board.turn == chess.WHITE) else -10000
                logger.debug("Mate sequence found move=%s mate=%s", move, mate_value)
            else:
                eval_value = float(eval_score)
            all_evals.append((move, eval_value))

        if not all_evals:
            logger.warning("No numeric evaluations after filtering")
            return PredictionReport(elapsed_seconds=time.time() - start_time)

        move_probabilities: Dict[str, float] = {}
        for sequence, logprob in top_sequences:
            probability = math.exp(logprob) * 100
            move_probabilities[sequence] = move_probabilities.get(sequence, 0.0) + probability

        logger.debug("Raw GPT probabilities for %s moves", len(move_probabilities))
        best_move_idx, best_eval_value = self._find_best_move_index(all_evals, board.turn)
        best_move = all_evals[best_move_idx][0]
        logger.debug("Best move from Stockfish=%s (eval=%s)", best_move, best_eval_value)

        if best_move not in move_probabilities:
            move_probabilities[best_move] = prob_threshold * 100
            logger.debug("Injected Stockfish best move '%s' with fallback probability", best_move)

        total_probability = sum(move_probabilities.values())
        if total_probability == 0:
            logger.warning("Total GPT probability is zero")
            return PredictionReport(elapsed_seconds=time.time() - start_time)

        raw_probabilities = {
            move: (prob / total_probability) * 100 for move, prob in move_probabilities.items()
        }
        normalized_initial = raw_probabilities.copy()

        win_percentages_1500 = {
            move: calculate_win_percentage(1500, eval_score) for move, eval_score in all_evals
        }
        win_percentages_rating = {
            move: calculate_win_percentage(rating, eval_score) for move, eval_score in all_evals
        }

        highest_1500, lowest_1500, second_highest_1500, second_lowest_1500 = self._find_win_percentages(
            win_percentages_1500
        )
        highest_rating, lowest_rating, second_highest_rating, second_lowest_rating = self._find_win_percentages(
            win_percentages_rating
        )

        diff_high_1500 = (highest_1500 - second_highest_1500) if second_highest_1500 is not None else 0
        diff_high_rating = (highest_rating - second_highest_rating) if second_highest_rating is not None else 0
        diff_low_1500 = (second_lowest_1500 - lowest_1500) if second_lowest_1500 is not None else 0
        diff_low_rating = (second_lowest_rating - lowest_rating) if second_lowest_rating is not None else 0

        if board.turn == chess.WHITE:
            best_move_importance = max(diff_high_1500, diff_high_rating)
        else:
            best_move_importance = max(diff_low_1500, diff_low_rating)
        logger.debug("Best move importance=%.4f", best_move_importance)

        intercept_best_move = {
            'classical': (((min(rating, 4100)) / 4100) + (20 * (best_move_importance / 100) ** 0.5)) * (min(rating, 4100)) / 4100,
            'rapid': (((min(rating, 3700)) / 3700) + (14 * (best_move_importance / 100)) ** 0.5) * (min(rating, 3700)) / 3700,
            'blitz': (((min(rating, 3600)) / 3600) + (6 * (best_move_importance / 100) ** 0.5)) * (min(rating, 3600)) / 3600,
            'bullet': (((min(rating, 3400)) / 3400) + (2 * (best_move_importance / 100) ** 0.5)) * (min(rating, 3400)) / 3400,
        }.get(
            context.game_type,
            (((min(rating, 4100)) / 4100) + (20 * (best_move_importance / 100) ** 0.5)) * (min(rating, 4100)) / 4100,
        )

        slope_best_move = (100 - intercept_best_move) / 100
        normalized_initial[best_move] = intercept_best_move + slope_best_move * normalized_initial[best_move]
        logger.debug(
            "Adjusted best move probability: intercept=%.2f slope=%.4f",
            intercept_best_move,
            slope_best_move,
        )

        total_probability = sum(normalized_initial.values())
        normalized_best_adjusted = {
            move: (prob / total_probability) * 100 for move, prob in normalized_initial.items()
        }

        percentage_losses: Dict[str, float] = {}
        multiplier = {
            'classical': 150,
            'rapid': 500,
            'blitz': 1000,
            'bullet': 4000,
        }.get(context.game_type, 150)

        for move in normalized_best_adjusted:
            win_percentage_1500 = win_percentages_1500[move]
            win_percentage_rating = win_percentages_rating[move]

            if board.turn == chess.WHITE:
                percentage_loss = max(
                    highest_1500 - win_percentage_1500,
                    highest_rating - win_percentage_rating,
                )
            else:
                percentage_loss = max(
                    win_percentage_1500 - lowest_1500,
                    win_percentage_rating - lowest_rating,
                )

            percentage_losses[move] = percentage_loss

            elo = adjusted_white if board.turn == chess.WHITE else adjusted_black
            mate_in = mate_in_dict.get(move)
            if mate_in is not None and mate_in > 0:
                if percentage_loss == 0:
                    normalized_best_adjusted[move] *= (1 + (elo / (multiplier * mate_in)))
                else:
                    normalized_best_adjusted[move] /= (1 + (elo / (multiplier * mate_in)))
            if percentage_loss > 0:
                normalized_best_adjusted[move] /= (1 + (percentage_loss / ((-19 * elo) / 600 + 131.67)))

        total_probability_modified = sum(normalized_best_adjusted.values())
        if total_probability_modified == 0:
            logger.warning("Probability collapsed after adjustments")
            return PredictionReport(elapsed_seconds=time.time() - start_time)

        normalized_final = {
            move: (prob / total_probability_modified) * 100
            for move, prob in normalized_best_adjusted.items()
        }

        if required_moves:
            for move_name in required_moves:
                if move_name not in normalized_final:
                    normalized_final[move_name] = 0.0
                    logger.debug("Injected required move '%s' with zero probability", move_name)

        sorted_moves = sorted(normalized_final.items(), key=lambda item: item[1], reverse=True)
        valid_moves = []
        for move, norm_prob in sorted_moves:
            eval_score = next((value for m, value in all_evals if m == move), None)
            if eval_score is None:
                continue
            valid_moves.append((move, norm_prob, eval_score))

        if not valid_moves:
            logger.warning("No valid moves survived filtering")
            return PredictionReport(elapsed_seconds=time.time() - start_time)

        valid_total_probability = sum(prob for _, prob, _ in valid_moves)
        if valid_total_probability == 0:
            logger.warning("Valid move probabilities sum to zero")
            return PredictionReport(elapsed_seconds=time.time() - start_time)

        normalized_moves = [
            (
                move,
                raw_prob,
                (raw_prob / valid_total_probability) * 100 if valid_total_probability else 0.0,
                eval_score,
            )
            for move, raw_prob, eval_score in valid_moves
        ]

        win_percentages: List[float] = []
        current_win_percentage = 0.0
        for move, raw_prob, new_norm_prob, eval_score in normalized_moves:
            win_percentage = calculate_win_percentage(high_rating, eval_score)
            win_percentages.append(win_percentage)
            current_win_percentage += win_percentage * new_norm_prob / 100

        best_move_notation = compute_best_move_notation(
            calculate_win_percentage(rating, best_eval_value),
            normalized_final[best_move],
            board.turn,
            current_win_percentage,
            (40.0, 80.0),
        )
        logger.debug(
            "Current evaluation=%.2f%% best_move_notation=%s",
            current_win_percentage,
            best_move_notation,
        )

        rows: List[MovePrediction] = []
        for index, (move, raw_prob, new_norm_prob, eval_score) in enumerate(normalized_moves):
            win_percentage = win_percentages[index]
            percentage_loss = percentage_losses.get(move, 0.0)
            is_best = move == best_move
            color, notation = get_color_and_notation(percentage_loss, is_best, best_move_notation)
            rows.append(
                MovePrediction(
                    move=move,
                    raw_probability=raw_probabilities.get(move, 0.0),
                    normalized_probability=new_norm_prob,
                    win_percentage=win_percentage,
                    percentage_loss=percentage_loss,
                    centipawn_eval=eval_score,
                    eval_with_mate=eval_with_mate_dict.get(move),
                    is_best=is_best,
                    notation=notation,
                    color_code=color,
                )
            )
            logger.debug(
                "Move #%s %s raw=%.2f norm=%.2f eval=%.2f%% loss=%.2f%% notation=%s",
                index + 1,
                move,
                raw_probabilities.get(move, 0.0),
                new_norm_prob,
                win_percentage,
                percentage_loss,
                notation,
            )

        elapsed = time.time() - start_time
        logger.debug(
            "Prediction complete in %.2fs (rows=%s)",
            elapsed,
            len(rows),
        )
        return PredictionReport(
            rows=rows,
            current_win_percentage=current_win_percentage,
            best_move_importance=best_move_importance,
            elapsed_seconds=elapsed,
            usage=self.sequence_predictor.get_usage(),
        )

    @staticmethod
    def _find_best_move_index(moves: List[tuple[str, float]], turn: bool) -> tuple[int, float]:
        if turn == chess.WHITE:
            best_move = max(moves, key=lambda item: item[1])
        else:
            best_move = min(moves, key=lambda item: item[1])
        return moves.index(best_move), best_move[1]

    @staticmethod
    def _find_win_percentages(values: Dict[str, float]):
        sorted_values = sorted(values.values())
        if not sorted_values:
            return 0, 0, None, None
        highest = sorted_values[-1]
        lowest = sorted_values[0]
        second_highest = sorted_values[-2] if len(sorted_values) > 1 else None
        second_lowest = sorted_values[1] if len(sorted_values) > 1 else None
        return highest, lowest, second_highest, second_lowest


__all__ = ["SingleMovePredictor"]
