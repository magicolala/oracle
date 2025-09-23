import logging
from typing import List, Tuple

import chess
import chess.engine

from oracle.services.evaluation import clamp_score


logger = logging.getLogger(__name__)


class StockfishEngine:
    def __init__(
        self,
        engine_path: str,
        time_limit: float,
        depth: int,
        threads: int,
        hash_size: int,
    ) -> None:
        self.engine_path = engine_path
        self.time_limit = time_limit
        self.depth = depth
        self.threads = threads
        self.hash_size = hash_size
        logger.debug(
            "Initialised StockfishEngine path=%s time_limit=%.2f depth=%s threads=%s hash=%s",
            engine_path,
            time_limit,
            depth,
            threads,
            hash_size,
        )

    def analyse_moves(self, board: chess.Board, multipv: int) -> List[Tuple[str, float]]:
        logger.debug("Launching Stockfish analysis (multipv=%s, fen=%s)", multipv, board.fen())
        engine = chess.engine.SimpleEngine.popen_uci(self.engine_path)
        engine.configure({"Threads": self.threads, "Hash": self.hash_size})

        try:
            info = engine.analyse(
                board,
                chess.engine.Limit(time=self.time_limit, depth=self.depth),
                multipv=multipv,
            )
        except Exception as exc:  # noqa: BLE001
            logger.exception("Stockfish analysis failed", exc_info=exc)
            return []
        finally:
            engine.quit()

        evals: List[Tuple[str, float]] = []
        for index in range(multipv):
            try:
                move_info = info[index]
                move = board.san(chess.Move.from_uci(move_info['pv'][0].uci()))
                eval_score = move_info['score'].relative

                if eval_score.is_mate():
                    mate_value = eval_score.mate()
                    evals.append((move, f"mate:{mate_value}"))
                    logger.debug("Stockfish mate sequence detected move=%s mate=%s", move, mate_value)
                else:
                    score = clamp_score(eval_score.score())
                    if board.turn == chess.BLACK:
                        score = -score
                    evals.append((move, score))
                    logger.debug("Stockfish evaluation move=%s score=%s", move, score)
            except Exception as exc:  # noqa: BLE001
                logger.exception("Failed to process Stockfish move index=%s", index, exc_info=exc)
                evals.append((None, None))
        logger.debug("Stockfish produced %s evaluations", len(evals))
        return evals


__all__ = ["StockfishEngine"]
