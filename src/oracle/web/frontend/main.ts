import './styles/board.css';
import { NeoChessBoard } from '@magicolala/neo-chess-board/core/NeoChessBoard';
import { ChessJsRules } from '@magicolala/neo-chess-board/core/ChessJsRules';
import { PGNRecorder } from '@magicolala/neo-chess-board/core/PGN';
import type { Move, Square } from '@magicolala/neo-chess-board/core/types';

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
type Mode = 'analyze' | 'play';

type StatusTone = 'info' | 'error' | 'success';

interface GameEndpoints {
  newGame: string;
  move: string;
  resign: string;
}

interface GameState {
  inProgress: boolean;
  awaitingResponse: boolean;
  lastStablePgn: string;
  selectedLevel: string;
}

declare global {
  interface Window {
    oracleBoard?: OracleBoardAPI;
  }
}

const boardReadyCallbacks: Array<(board: OracleBoardAPI) => void> = [];
let sharedBoardInstance: OracleBoardAPI | undefined;

function whenBoardReady(callback: (board: OracleBoardAPI) => void): void {
  if (sharedBoardInstance) {
    callback(sharedBoardInstance);
    return;
  }
  boardReadyCallbacks.push(callback);
}

function notifyBoardReady(board: OracleBoardAPI): void {
  sharedBoardInstance = board;
  while (boardReadyCallbacks.length > 0) {
    const callback = boardReadyCallbacks.shift();
    callback?.(board);
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

function bootstrapBoard(): void {
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
  notifyBoardReady(api);
  emitUpdate();
}

function setupIndexPage(): void {
  const root = document.querySelector<HTMLElement>('[data-app-root]');
  if (!root) {
    return;
  }

  const textarea = document.getElementById('pgn') as HTMLTextAreaElement | null;
  const loadButton = root.querySelector<HTMLButtonElement>('[data-load-pgn]');
  const resetButton = root.querySelector<HTMLButtonElement>('[data-reset-board]');
  const modeInputs = root.querySelectorAll<HTMLInputElement>('[data-mode-input]');
  const panels = root.querySelectorAll<HTMLElement>('[data-mode-panel]');
  const newGameButton = root.querySelector<HTMLButtonElement>('[data-game-new]');
  const resignButton = root.querySelector<HTMLButtonElement>('[data-game-resign]');
  const gameStatus = root.querySelector<HTMLElement>('[data-game-status]');
  const playLevelSelect = root.querySelector<HTMLSelectElement>('[data-game-level]');
  const boardPanel = root.querySelector<HTMLElement>('.board-panel');
  const boardLoader = document.createElement('div');
  boardLoader.id = 'board-loader';
  boardLoader.className = 'board-loader';
  boardLoader.hidden = true;
  boardLoader.innerHTML = `
    <div class="spinner-border text-light" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  `;
  boardPanel?.appendChild(boardLoader);

  const parseEndpoint = (value: string | undefined): string =>
    value && value.trim().length > 0 ? value.trim() : '';

  let mode: Mode = root.dataset.activeMode === 'play' ? 'play' : 'analyze';
  let board: OracleBoardAPI | undefined;
  let suppress = false;

  const endpoints: GameEndpoints = {
    newGame: parseEndpoint(root.dataset.gameNewEndpoint),
    move: parseEndpoint(root.dataset.gameMoveEndpoint),
    resign: parseEndpoint(root.dataset.gameResignEndpoint),
  };

  const gameState: GameState = {
    inProgress: false,
    awaitingResponse: false,
    lastStablePgn: '',
    selectedLevel: playLevelSelect?.value?.trim() ?? '',
  };

  const withSuppressed = (callback: () => void): void => {
    suppress = true;
    try {
      callback();
    } finally {
      suppress = false;
    }
  };

  const setTextareaValue = (value: string): void => {
    if (!textarea) {
      return;
    }
    textarea.value = value;
  };

  const updatePanels = (): void => {
    panels.forEach((panel) => {
      const panelMode = (panel.dataset.modePanel as Mode | undefined) ?? 'analyze';
      panel.toggleAttribute('hidden', panelMode !== mode);
    });
    if (textarea) {
      if (mode === 'play') {
        textarea.setAttribute('readonly', 'true');
      } else {
        textarea.removeAttribute('readonly');
      }
    }
  };

  const updateGameControls = (): void => {
    const inPlayMode = mode === 'play';
    if (newGameButton) {
      newGameButton.disabled = !inPlayMode || gameState.awaitingResponse;
    }
    if (resignButton) {
      resignButton.disabled = !inPlayMode || !gameState.inProgress || gameState.awaitingResponse;
    }
  };

  const setStatus = (message?: string, tone: StatusTone = 'info'): void => {
    if (!gameStatus) {
      return;
    }
    if (!message) {
      gameStatus.textContent = '';
      gameStatus.hidden = true;
      gameStatus.classList.remove('alert-info', 'alert-danger', 'alert-success');
      return;
    }
    gameStatus.hidden = false;
    gameStatus.textContent = message;
    gameStatus.classList.remove('alert-info', 'alert-danger', 'alert-success');
    const className = tone === 'error' ? 'alert-danger' : tone === 'success' ? 'alert-success' : 'alert-info';
    gameStatus.classList.add(className);
  };

  const syncBoardToTextarea = (): void => {
    if (!board || !textarea) {
      return;
    }
    const rawValue = textarea.value.trim();
    withSuppressed(() => {
      if (rawValue.length > 0) {
        const loaded = board.loadPgn(rawValue);
        if (!loaded) {
          board.reset();
        }
      } else {
        board.reset();
      }
    });
    const normalized = board.getPgn();
    setTextareaValue(normalized);
    gameState.lastStablePgn = normalized;
  };

  const revertToStable = (fallback?: string): void => {
    if (!board) {
      return;
    }
    const target = (fallback ?? gameState.lastStablePgn).trim();
    withSuppressed(() => {
      if (target.length > 0) {
        const loaded = board.loadPgn(target);
        if (!loaded) {
          board.reset();
        }
      } else {
        board.reset();
      }
    });
    const normalized = board.getPgn();
    setTextareaValue(normalized);
  };

  const applyServerUpdate = (pgn: string, data: any): void => {
    if (!board) {
      return;
    }
    const trimmed = typeof pgn === 'string' ? pgn.trim() : '';
    withSuppressed(() => {
      if (trimmed.length > 0) {
        const loaded = board.loadPgn(trimmed);
        if (!loaded) {
          board.reset();
        }
      } else {
        board.reset();
      }
    });
    const normalized = board.getPgn();
    gameState.lastStablePgn = normalized;
    setTextareaValue(normalized);

    const finished = Boolean(data?.finished);
    let message: string | undefined;
    if (typeof data?.status === 'string') {
      message = data.status;
    } else if (typeof data?.message === 'string') {
      message = data.message;
    } else if (finished) {
      message = 'Partie terminée.';
    }
    setStatus(message ?? 'Coup joué.', finished ? 'success' : 'info');

    if (finished) {
      gameState.inProgress = false;
    }
    updateGameControls();
  };

  const postJson = async (url: string, payload: Record<string, unknown>): Promise<any> => {
    if (!url) {
      throw new Error('Endpoint de partie indisponible.');
    }
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`Erreur serveur (${response.status}) lors de l'échange avec l'ordinateur.`);
    }
    const contentType = response.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      return response.json();
    }
    return {};
  };

  const ensureLevelPayload = (): string | undefined => {
    const value = gameState.selectedLevel.trim();
    return value.length > 0 ? value : undefined;
  };

  const setMode = (nextMode: Mode, options: { force?: boolean } = {}): void => {
    const { force = false } = options;
    if (!force && mode === nextMode) {
      return;
    }
    mode = nextMode;
    updatePanels();
    updateGameControls();

    if (mode === 'analyze') {
      setStatus();
      if (board) {
        syncBoardToTextarea();
      }
      return;
    }

    gameState.inProgress = false;
    gameState.awaitingResponse = false;
    if (board) {
      withSuppressed(() => board.reset());
      const normalized = board.getPgn();
      gameState.lastStablePgn = normalized;
      setTextareaValue(normalized);
    } else {
      setTextareaValue('');
      gameState.lastStablePgn = '';
    }
    setStatus('Choisissez un niveau puis démarrez une partie.', 'info');
    updateGameControls();
  };

  modeInputs.forEach((input) => {
    input.addEventListener('change', () => {
      if (!input.checked) {
        return;
      }
      setMode(input.value === 'play' ? 'play' : 'analyze');
    });
  });

  loadButton?.addEventListener('click', () => {
    if (mode !== 'analyze') {
      return;
    }
    syncBoardToTextarea();
    textarea?.focus();
  });

  resetButton?.addEventListener('click', () => {
    if (mode !== 'analyze' || !board) {
      return;
    }
    withSuppressed(() => board.reset());
    const normalized = board.getPgn();
    setTextareaValue(normalized);
    textarea?.focus();
  });

  playLevelSelect?.addEventListener('change', () => {
    gameState.selectedLevel = playLevelSelect.value?.trim() ?? '';
  });

  const analysisForm = document.querySelector<HTMLFormElement>('form[action="/analyze"]');
  analysisForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = analysisForm.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (!submitButton) {
      return;
    }

    const originalButtonContent = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = `
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Analyse en cours...
    `;

    try {
      const formData = new FormData(analysisForm);
      const response = await fetch(analysisForm.action, {
        method: analysisForm.method,
        body: new URLSearchParams(formData as any),
      });

      if (!response.ok) {
        throw new Error(`Erreur serveur (${response.status}) lors de l'analyse.`);
      }

      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const newContent = doc.querySelector('.col-12.col-xl-10.col-xxl-9');
      const currentContent = document.querySelector('.col-12.col-xl-10.col-xxl-9');

      if (newContent && currentContent) {
        currentContent.innerHTML = newContent.innerHTML;
        executeScripts(newContent);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Une erreur inattendue est survenue.';
      setStatus(message, 'error');
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonContent;
    }
  });

  const executeScripts = (container: HTMLElement) => {
    const scripts = Array.from(container.querySelectorAll('script'));
    scripts.forEach((script) => {
      const newScript = document.createElement('script');
      if (script.src) {
        newScript.src = script.src;
        newScript.async = false; // Ensure scripts execute in order
      } else {
        newScript.textContent = script.textContent;
      }
      // Add attributes
      for (const { name, value } of script.attributes) {
        newScript.setAttribute(name, value);
      }
      script.parentNode?.replaceChild(newScript, script);
    });
  };

  newGameButton?.addEventListener('click', async () => {
    if (mode !== 'play') {
      setMode('play');
    }
    if (!board || gameState.awaitingResponse) {
      if (!board) {
        setStatus('Plateau en cours de chargement…', 'info');
      }
      return;
    }
    gameState.awaitingResponse = true;
    updateGameControls();
    const originalButtonContent = newGameButton.innerHTML;
    newGameButton.innerHTML = `
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Démarrage...
    `;
    setStatus('Initialisation de la partie…', 'info');
    try {
      const payload: Record<string, unknown> = {};
      const level = ensureLevelPayload();
      if (level) {
        payload.level = level;
      }
      const data = await postJson(endpoints.newGame, payload);
      withSuppressed(() => {
        board.reset();
        if (typeof data?.pgn === 'string' && data.pgn.trim().length > 0) {
          board.loadPgn(data.pgn);
        }
      });
      const normalized = board.getPgn();
      gameState.lastStablePgn = normalized;
      gameState.inProgress = true;
      setTextareaValue(normalized);
      const message =
        typeof data?.status === 'string' ? data.status : 'La partie a démarré.';
      setStatus(message, 'info');
    } catch (error) {
      console.error('[oracle-board] Unable to start game:', error);
      const message =
        error instanceof Error ? error.message : 'Impossible de démarrer la partie.';
      setStatus(message, 'error');
    } finally {
      newGameButton.innerHTML = originalButtonContent;
      gameState.awaitingResponse = false;
      updateGameControls();
    }
  });

  resignButton?.addEventListener('click', async () => {
    if (mode !== 'play' || !board || !gameState.inProgress || gameState.awaitingResponse) {
      return;
    }
    gameState.awaitingResponse = true;
    updateGameControls();
    setStatus('Abandon en cours…', 'info');
    try {
      const payload: Record<string, unknown> = { pgn: gameState.lastStablePgn };
      const level = ensureLevelPayload();
      if (level) {
        payload.level = level;
      }
      const data = await postJson(endpoints.resign, payload);
      if (typeof data?.pgn === 'string') {
        withSuppressed(() => {
          if (data.pgn.trim().length > 0) {
            board.loadPgn(data.pgn);
          } else {
            board.reset();
          }
        });
      }
      const normalized = board.getPgn();
      setTextareaValue(normalized);
      gameState.lastStablePgn = normalized;
      gameState.inProgress = false;
      const message =
        typeof data?.status === 'string' ? data.status : 'Vous avez abandonné la partie.';
      setStatus(message, 'success');
    } catch (error) {
      console.error('[oracle-board] Unable to resign game:', error);
      const message =
        error instanceof Error ? error.message : "Impossible d'abandonner la partie.";
      setStatus(message, 'error');
      gameState.inProgress = false;
    } finally {
      gameState.awaitingResponse = false;
      updateGameControls();
    }
  });

  whenBoardReady((api) => {
    board = api;

    if (mode === 'analyze') {
      syncBoardToTextarea();
    } else if (board) {
      withSuppressed(() => board.reset());
      const normalized = board.getPgn();
      gameState.lastStablePgn = normalized;
      setTextareaValue(normalized);
      setStatus('Choisissez un niveau puis démarrez une partie.', 'info');
    }

    board?.onMove((payload) => {
      if (!board || suppress) {
        return;
      }
      if (mode === 'analyze') {
        setTextareaValue(board.getPgn());
        return;
      }
      if (!gameState.inProgress) {
        setStatus('Lancez une nouvelle partie pour jouer.', 'error');
        revertToStable();
        return;
      }
      if (gameState.awaitingResponse) {
        revertToStable();
        return;
      }
      const previousPgn = gameState.lastStablePgn;
      const playerPgn = board.getPgn();
      const requestPayload: Record<string, unknown> = {
        move: payload.san ?? '',
        from: payload.from,
        to: payload.to,
        fen: payload.fen,
        pgn: playerPgn,
      };
      const level = ensureLevelPayload();
      if (level) {
        requestPayload.level = level;
      }
      gameState.awaitingResponse = true;
      updateGameControls();
      boardLoader.hidden = false;
      setStatus('Coup envoyé, attente de la réponse…', 'info');
      postJson(endpoints.move, requestPayload)
        .then((data) => {
          const responsePgn =
            data && typeof data.pgn === 'string' ? data.pgn : playerPgn;
          applyServerUpdate(responsePgn, data);
        })
        .catch((error) => {
          console.error('[oracle-board] Unable to send move:', error);
          const message =
            error instanceof Error ? error.message : "Impossible d'envoyer le coup.";
          setStatus(message, 'error');
          revertToStable(previousPgn);
        })
        .finally(() => {
          boardLoader.hidden = true;
          gameState.awaitingResponse = false;
          updateGameControls();
        });
    });

    board?.onUpdate(({ pgn }) => {
      if (suppress) {
        return;
      }
      if (mode === 'analyze') {
        if (!textarea || document.activeElement === textarea) {
          return;
        }
        setTextareaValue(pgn);
        return;
      }
      if (!gameState.awaitingResponse) {
        gameState.lastStablePgn = pgn;
      }
      setTextareaValue(pgn);
    });
  });

  setMode(mode, { force: true });
}

function onDomReady(): void {
  setupIndexPage();
  bootstrapBoard();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onDomReady, { once: true });
} else {
  onDomReady();
}