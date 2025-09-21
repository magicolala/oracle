import './styles/board.css';
import { NeoChessBoard } from '@magicolala/neo-chess-board/core/NeoChessBoard';
import { ChessJsRules } from '@magicolala/neo-chess-board/core/ChessJsRules';
import { PGNRecorder } from '@magicolala/neo-chess-board/core/PGN';
import type { Square, Move } from '@magicolala/neo-chess-board/core/types';

interface MovePayload {
  from: Square;
  to: Square;
  fen: string;
  san?: string;
}

interface UpdatePayload {
  fen: string;
  pgn: string;
}

interface OracleBoardAPI {
  loadPgn: (pgn: string) => boolean;
  reset: () => void;
  getFen: () => string;
  getPgn: () => string;
  onMove: (listener: (payload: MovePayload) => void) => void;
  onUpdate: (listener: (payload: UpdatePayload) => void) => void;
}

type VerboseMove = Partial<Move> & { san?: string };

declare global {
  interface Window {
    oracleBoard?: OracleBoardAPI;
  }
}

function toRecorderMove(move: Partial<Move>): Move {
  return {
    from: move.from as Square,
    to: move.to as Square,
    promotion: move.promotion,
    captured: move.captured ?? undefined,
    san: move.san,
  };
}

function bootstrapBoard() {
  const container = document.getElementById('oracle-board');
  if (!container) {
    console.warn('[oracle-board] Missing container #oracle-board.');
    return;
  }

  const rules = new ChessJsRules();
  const board = new NeoChessBoard(container, {
    rulesAdapter: rules,
    interactive: true,
    highlightLegal: true,
    showCoordinates: true,
    showHighlights: true,
    showArrows: true,
    allowPremoves: false,
    animationMs: 200,
    soundEnabled: false,
  });

  const recorder = new PGNRecorder(rules);
  const historyProvider = rules as unknown as {
    getHistory?: () => VerboseMove[];
    history?: (options?: { verbose: boolean }) => VerboseMove[];
  };

  const readVerboseHistory = (): VerboseMove[] => {
    if (typeof historyProvider.getHistory === 'function') {
      return historyProvider.getHistory();
    }
    if (typeof historyProvider.history === 'function') {
      try {
        return historyProvider.history({ verbose: true }) ?? [];
      } catch (error) {
        console.warn('[oracle-board] Unable to access verbose history.', error);
      }
    }
    return [];
  };

  const rebuildRecorderFromHistory = () => {
    recorder.reset();
    readVerboseHistory().forEach((entry) => recorder.push(toRecorderMove(entry)));
  };

  let moveListener: ((payload: MovePayload) => void) | undefined;
  let updateListener: ((payload: UpdatePayload) => void) | undefined;

  const emitUpdate = () => {
    updateListener?.({ fen: rules.getFEN(), pgn: recorder.getPGN() });
  };

  board.on('move', (event) => {
    const { from, to, fen } = event;
    const history = readVerboseHistory();
    const last = history[history.length - 1];
    if (last) {
      recorder.push(toRecorderMove(last));
      moveListener?.({ from, to, fen, san: last.san });
    } else {
      recorder.push(toRecorderMove({ from, to }));
      moveListener?.({ from, to, fen });
    }
    emitUpdate();
  });

  board.on('update', () => emitUpdate());

  const api: OracleBoardAPI = {
    loadPgn(pgn: string) {
      if (typeof pgn !== 'string' || pgn.trim().length === 0) {
        return false;
      }
      const success = board.loadPgnWithAnnotations(pgn);
      if (success) {
        rebuildRecorderFromHistory();
        emitUpdate();
      }
      return success;
    },
    reset() {
      if (typeof (rules as { reset?: () => void }).reset === 'function') {
        (rules as { reset: () => void }).reset();
      } else {
        rules.setFEN('start');
      }
      recorder.reset();
      board.setFEN(rules.getFEN(), true);
      emitUpdate();
    },
    getFen() {
      return rules.getFEN();
    },
    getPgn() {
      return recorder.getPGN();
    },
    onMove(listener) {
      moveListener = listener;
    },
    onUpdate(listener) {
      updateListener = listener;
      emitUpdate();
    },
  };

  window.oracleBoard = api;
  document.dispatchEvent(
    new CustomEvent('oracle-board:ready', {
      detail: api,
    }),
  );
  emitUpdate();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapBoard, { once: true });
} else {
  bootstrapBoard();
}
