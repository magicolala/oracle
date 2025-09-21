"""Predict next moves use case implementation."""
from __future__ import annotations

import io
import math
from dataclasses import dataclass

import chess
import chess.pgn

from oracle.application.ports import (
    MoveAnalyzer,
    PredictNextMovesUseCase,
    SequenceProvider,
)
from oracle.domain import MovePrediction, OracleConfig, PredictionMetrics, PredictionResult
from oracle.domain.services import (
    adjust_rating,
    calculate_win_percentage,
    clean_pgn,
    determine_game_type,
    find_best_move_index,
    get_best_move_notation,
    get_color_and_notation,
)


@dataclass
class PredictNextMoves(PredictNextMovesUseCase):
    """Application service orchestrating prediction ports."""

    sequence_provider: SequenceProvider
    move_analyzer: MoveAnalyzer
    config: OracleConfig

    def execute(self, pgn: str) -> PredictionResult:
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
        white_elo_val = (
            int(white_elo) if white_elo and white_elo.isdigit() else self.config.default_white_elo
        )
        black_elo_val = (
            int(black_elo) if black_elo and black_elo.isdigit() else self.config.default_black_elo
        )

        time_control = game.headers.get("TimeControl")
        if time_control:
            game_type = determine_game_type(time_control)
            if game_type == "Unknown":
                game_type = self.config.default_game_type
        else:
            game_type = self.config.default_game_type

        white_elo_val = adjust_rating(white_elo_val, game_type)
        black_elo_val = adjust_rating(black_elo_val, game_type)

        rating = white_elo_val if board.turn == chess.WHITE else black_elo_val
        high_rating = max(white_elo_val, black_elo_val)

        legal_moves = [board.san(move) for move in board.legal_moves]
        if not legal_moves:
            return PredictionResult(moves=[], current_win_percentage=0.0, metrics=metrics)

        top_sequences = self.sequence_provider.get_top_sequences(
            prompt,
            legal_moves.copy(),
            self.config.depth,
            metrics,
            prob_threshold=self.config.prob_threshold,
            temperature=self.config.temperature,
            top_p=self.config.top_p,
            top_k=self.config.top_k,
            repetition_penalty=self.config.repetition_penalty,
        )

        all_evals_with_mate = self.move_analyzer.analyze(
            board,
            len(legal_moves),
            self.config.analysis_time_limit,
            self.config.analysis_depth,
            self.config.analysis_threads,
            self.config.analysis_hash_size,
        )

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

        if not all_evals:
            return PredictionResult(moves=[], current_win_percentage=0.0, metrics=metrics)

        move_probabilities: dict[str, float] = {}
        for seq, logprob in top_sequences:
            probability = math.exp(logprob) * 100
            move_probabilities[seq] = move_probabilities.get(seq, 0.0) + probability

        is_white_turn = board.turn == chess.WHITE
        best_move_idx, best_eval_value = find_best_move_index(all_evals, is_white_turn)
        best_move = all_evals[best_move_idx][0]

        if best_move not in move_probabilities:
            move_probabilities[best_move] = self.config.prob_threshold * 100

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

        if is_white_turn:
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

            if is_white_turn:
                percentage_loss_1500 = highest_1500 - win_percentage_1500
                percentage_loss_rating = highest_rating - win_percentage_rating
            else:
                percentage_loss_1500 = win_percentage_1500 - lowest_1500
                percentage_loss_rating = win_percentage_rating - lowest_rating

            percentage_loss = max(percentage_loss_1500, percentage_loss_rating)
            percentage_losses[move] = percentage_loss

            elo = white_elo_val if is_white_turn else black_elo_val

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
            is_white_turn,
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
