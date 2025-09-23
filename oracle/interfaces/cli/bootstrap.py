from oracle.config import Settings
from oracle.infrastructure.openai_client import OpenAISequencePredictor
from oracle.infrastructure.stockfish_engine import StockfishEngine
from oracle.usecases.batch_prediction import BatchPredictionService
from oracle.usecases.single_move import SingleMovePredictor


def create_single_move_predictor(settings: Settings) -> SingleMovePredictor:
    sequence_predictor = OpenAISequencePredictor(settings.openai_api_key, settings.model_name)
    stockfish = StockfishEngine(
        settings.stockfish_path,
        settings.time_limit,
        settings.depth,
        settings.threads,
        settings.hash_size,
    )
    return SingleMovePredictor(sequence_predictor, stockfish)


def create_batch_service(settings: Settings) -> BatchPredictionService:
    sequence_predictor = OpenAISequencePredictor(settings.openai_api_key, settings.model_name)
    stockfish = StockfishEngine(
        settings.stockfish_path,
        settings.time_limit,
        settings.depth,
        settings.threads,
        settings.hash_size,
    )
    single_predictor = SingleMovePredictor(sequence_predictor, stockfish)
    return BatchPredictionService(single_predictor)


__all__ = ["create_single_move_predictor", "create_batch_service"]
