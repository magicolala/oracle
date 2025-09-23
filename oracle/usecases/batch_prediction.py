import logging
import re
import time
from typing import Optional

import chess

from oracle.domain.models import (
    BatchPredictionRow,
    BatchPredictionSummary,
    GameContext,
    TokenUsage,
)
from oracle.services.evaluation import adjust_rating, determine_game_type
from oracle.services.pgn import extract_moves_from_file, generate_prompts
from oracle.usecases.single_move import SingleMovePredictor


logger = logging.getLogger(__name__)


class BatchPredictionService:
    def __init__(self, predictor: SingleMovePredictor) -> None:
        self.predictor = predictor
        logger.debug("BatchPredictionService initialised")

    def analyse_file(
        self,
        pgn_path: str,
        depth: int = 5,
        prob_threshold: float = 0.001,
        default_rating: int = 2000,
        default_game_type: str = "classical",
    ) -> BatchPredictionSummary:
        logger.debug(
            "Starting batch analysis pgn=%s depth=%s threshold=%s",
            pgn_path,
            depth,
            prob_threshold,
        )
        prompts = generate_prompts(pgn_path)
        all_moves = extract_moves_from_file(pgn_path)
        logger.debug("Loaded %s prompts and %s moves", len(prompts), len(all_moves))

        usage = TokenUsage()
        rows: list[BatchPredictionRow] = []
        move_index = 0
        current_game_index: Optional[int] = None
        current_move_number = 1
        total_moves = 0
        start_time = time.time()

        for game_index, _, prompt in prompts:
            if move_index >= len(all_moves):
                logger.debug("Reached end of moves at index=%s", move_index)
                break

            actual_move = all_moves[move_index]
            logger.debug("Analysing game=%s move_index=%s actual_move=%s", game_index, move_index, actual_move)

            if game_index != current_game_index:
                current_game_index = game_index
                current_move_number = 1
                logger.debug("Switching to new game %s", game_index)

            header_content = "\n".join(prompt.split("\n\n")[:-1])
            white_elo = self._parse_elo(header_content, "WhiteElo", default_rating)
            black_elo = self._parse_elo(header_content, "BlackElo", default_rating)

            time_control = self._parse_time_control(header_content)
            if time_control:
                game_type = determine_game_type(time_control)
            else:
                game_type = default_game_type

            game_type = game_type.lower()
            adjusted_white = adjust_rating(white_elo, game_type)
            adjusted_black = adjust_rating(black_elo, game_type)
            logger.debug(
                "Game %s ratings raw=(%s,%s) adjusted=(%s,%s) type=%s",
                game_index,
                white_elo,
                black_elo,
                adjusted_white,
                adjusted_black,
                game_type,
            )

            board = chess.Board()
            components = prompt.split("\n\n")
            moves_section = components[1] if len(components) > 1 else ""
            for token in moves_section.strip().split(" "):
                if re.match(r"\d+\.", token):
                    continue
                if not token:
                    continue
                try:
                    board.push_san(token)
                except ValueError:
                    logger.debug("Ignoring invalid move token '%s'", token)
                    continue

            rating = adjusted_white if board.turn == chess.WHITE else adjusted_black
            side_indicator = "." if board.turn == chess.WHITE else "..."

            context = GameContext(
                pgn=prompt,
                white_elo=white_elo,
                black_elo=black_elo,
                game_type=game_type,
            )

            report = self.predictor.predict(
                context,
                depth=depth,
                prob_threshold=prob_threshold,
                required_moves=[actual_move],
            )

            self._accumulate_usage(usage, report.usage)
            logger.debug(
                "Accumulated usage totals: input=%s output=%s cost=%.6f",
                usage.input_tokens,
                usage.output_tokens,
                usage.cost_usd,
            )

            for prediction in report.rows:
                rows.append(
                    BatchPredictionRow(
                        game_index=game_index,
                        move_number=current_move_number,
                        side_to_move=side_indicator,
                        prediction=prediction.move,
                        notation=prediction.notation,
                        raw_probability=prediction.raw_probability,
                        normalized_probability=prediction.normalized_probability,
                        win_percentage=prediction.win_percentage,
                        eval_centipawns=prediction.centipawn_eval,
                        eval_with_mate=prediction.eval_with_mate,
                        is_played=prediction.move == actual_move,
                        best_move_importance=report.best_move_importance,
                        rating=rating,
                        game_type=game_type,
                    )
                )

            move_index += 1
            total_moves += 1

            if board.turn == chess.BLACK:
                current_move_number += 1

        elapsed = time.time() - start_time
        logger.debug(
            "Batch analysis complete (rows=%s, total_moves=%s, elapsed=%.2fs)",
            len(rows),
            total_moves,
            elapsed,
        )
        return BatchPredictionSummary(
            rows=rows,
            total_moves=total_moves,
            elapsed_seconds=elapsed,
            usage=usage,
        )

    @staticmethod
    def _parse_elo(content: str, tag: str, default: int) -> int:
        match = re.search(rf"\\[{tag}\\s+\"(\\d+)\"]", content)
        if match:
            try:
                return int(match.group(1))
            except ValueError:
                logger.debug("Invalid Elo value for %s: %s", tag, match.group(1))
                return default
        return default

    @staticmethod
    def _parse_time_control(content: str) -> Optional[str]:
        match = re.search(r"\\[TimeControl\\s+\"([^\"]+)\"]", content)
        return match.group(1) if match else None

    @staticmethod
    def _accumulate_usage(target: TokenUsage, source: TokenUsage) -> None:
        target.input_tokens += source.input_tokens
        target.output_tokens += source.output_tokens
        target.cost_usd += source.cost_usd


__all__ = ["BatchPredictionService"]
