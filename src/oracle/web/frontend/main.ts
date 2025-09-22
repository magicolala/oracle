import './styles/board.css';
import Chart from 'chart.js/auto';
import type { ChartConfiguration, TooltipItem } from 'chart.js';
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
type Mode = 'analyze' | 'play' | 'prediction';

const ANALYSIS_MODES: readonly Mode[] = ['analyze', 'prediction'] as const;

const isAnalysisMode = (value: Mode): boolean => ANALYSIS_MODES.includes(value);

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

interface MoveChartPoint {
  label: string;
  likelihood: number;
  winPercentage: number;
  isBestMove: boolean;
}

interface OracleChartsAPI {
  refreshCharts: (root?: Document | Element) => void;
}

declare global {
  interface Window {
    oracleBoard?: OracleBoardAPI;
    oracleCharts?: OracleChartsAPI;
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

const chartInstances = new WeakMap<HTMLCanvasElement, Chart>();
let chartTabEventsBound = false;

const CHART_CANVAS_SELECTOR = '[data-prediction-chart]';

function clampPercentage(value: number): number {
  if (Number.isNaN(value)) {
    return 0;
  }
  return Math.min(100, Math.max(0, value));
}

function parsePercentage(input: unknown): number | null {
  if (typeof input === 'number' && Number.isFinite(input)) {
    return clampPercentage(input);
  }
  if (typeof input === 'string') {
    const parsed = Number.parseFloat(input);
    if (Number.isFinite(parsed)) {
      return clampPercentage(parsed);
    }
  }
  return null;
}

function parseChartPoints(canvas: HTMLCanvasElement): MoveChartPoint[] {
  const rawSeries = canvas.dataset.chartSeries;
  if (!rawSeries) {
    return [];
  }
  try {
    const parsed = JSON.parse(rawSeries) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .map((entry): MoveChartPoint | null => {
        if (!entry || typeof entry !== 'object') {
          return null;
        }
        const record = entry as Record<string, unknown>;
        const rawLabel = record.label ?? record.move;
        const label = typeof rawLabel === 'string' ? rawLabel.trim() : '';
        if (!label) {
          return null;
        }
        const likelihood = parsePercentage(record.likelihood);
        const evaluation = parsePercentage(record.win_percentage ?? record.winPercentage);
        if (likelihood === null || evaluation === null) {
          return null;
        }
        const isBestMove = Boolean(record.is_best_move ?? record.isBestMove);
        return {
          label,
          likelihood,
          winPercentage: evaluation,
          isBestMove,
        };
      })
      .filter((entry): entry is MoveChartPoint => entry !== null);
  } catch (error) {
    console.warn('[oracle-board] Unable to parse chart payload.', error);
    return [];
  }
}

function extractTooltipValue(context: TooltipItem<'bar'>): number | null {
  const parsed = context.parsed as unknown;
  if (typeof parsed === 'number' && Number.isFinite(parsed)) {
    return parsed;
  }
  if (parsed && typeof parsed === 'object' && 'y' in parsed) {
    const candidate = (parsed as { y?: unknown }).y;
    if (typeof candidate === 'number' && Number.isFinite(candidate)) {
      return candidate;
    }
  }
  return null;
}

function buildChartConfiguration(points: MoveChartPoint[]): ChartConfiguration<'bar', (number | null)[], string> {
  const labels = points.map((point) => point.label);
  const likelihoods = points.map((point) => point.likelihood);
  const evaluations = points.map((point) => point.winPercentage);
  const backgroundColors = points.map((point) =>
    point.isBestMove ? 'rgba(25, 135, 84, 0.7)' : 'rgba(13, 110, 253, 0.65)',
  );
  const borderColors = points.map((point) =>
    point.isBestMove ? 'rgba(25, 135, 84, 1)' : 'rgba(13, 110, 253, 1)',
  );

  return {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          type: 'bar',
          label: 'Probabilité (%)',
          data: likelihoods,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
          yAxisID: 'likelihood',
        },
        {
          type: 'line',
          label: 'Score attendu (%)',
          data: evaluations,
          borderColor: 'rgba(220, 53, 69, 0.85)',
          backgroundColor: 'rgba(220, 53, 69, 0.85)',
          yAxisID: 'evaluation',
          tension: 0.25,
          fill: false,
          pointRadius: 4,
          pointHoverRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 0,
          },
        },
        likelihood: {
          beginAtZero: true,
          min: 0,
          max: 100,
          position: 'left',
          title: {
            display: true,
            text: 'Probabilité (%)',
          },
          ticks: {
            callback(value) {
              return `${value}%`;
            },
          },
        },
        evaluation: {
          beginAtZero: true,
          min: 0,
          max: 100,
          position: 'right',
          grid: {
            drawOnChartArea: false,
          },
          title: {
            display: true,
            text: 'Score attendu (%)',
          },
          ticks: {
            callback(value) {
              return `${value}%`;
            },
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
          },
        },
        tooltip: {
          callbacks: {
            label(context: TooltipItem<'bar'>) {
              const baseLabel = context.dataset.label ?? '';
              const value = extractTooltipValue(context);
              if (!Number.isFinite(value ?? Number.NaN)) {
                return baseLabel;
              }
              const formatted = (value as number).toFixed(2);
              return baseLabel ? `${baseLabel}: ${formatted}%` : `${formatted}%`;
            },
          },
        },
      },
    },
  } as ChartConfiguration<'bar', (number | null)[], string>;
}

function ensureChartForCanvas(canvas: HTMLCanvasElement): void {
  if (chartInstances.has(canvas)) {
    return;
  }
  const context = canvas.getContext('2d');
  if (!context) {
    console.warn('[oracle-board] Chart canvas is missing a 2D context.');
    return;
  }
  const points = parseChartPoints(canvas);
  if (points.length === 0) {
    return;
  }
  const configuration = buildChartConfiguration(points);
  const chart = new Chart(context, configuration);
  chartInstances.set(canvas, chart);
}

function renderChartsInPane(pane: Element): void {
  const canvases = pane.querySelectorAll<HTMLCanvasElement>(CHART_CANVAS_SELECTOR);
  canvases.forEach((canvas) => ensureChartForCanvas(canvas));
}

function handleTabShown(event: Event): void {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  const selector = target.getAttribute('data-bs-target');
  if (!selector) {
    return;
  }
  const pane = document.querySelector(selector);
  if (pane instanceof Element) {
    renderChartsInPane(pane);
  }
}

function setupResultPageCharts(root: Document | Element = document): void {
  const canvases = root.querySelectorAll<HTMLCanvasElement>(CHART_CANVAS_SELECTOR);
  if (canvases.length === 0) {
    return;
  }

  if (!chartTabEventsBound) {
    const delegatedHandler = (event: Event) => handleTabShown(event);
    document.addEventListener('shown.bs.tab', delegatedHandler);
    chartTabEventsBound = true;
  }

  canvases.forEach((canvas) => {
    const pane = canvas.closest('.tab-pane');
    if (!pane) {
      ensureChartForCanvas(canvas);
      return;
    }
    if (pane.classList.contains('active') && pane.classList.contains('show')) {
      ensureChartForCanvas(canvas);
    }
  });
}

window.oracleCharts = {
  refreshCharts(root?: Document | Element) {
    setupResultPageCharts(root ?? document);
  },
};

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
  const modeInputs = document.querySelectorAll<HTMLInputElement>('[data-mode-input]');
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

  const parseMode = (value: string | undefined): Mode => {
    if (value === 'play') {
      return 'play';
    }
    if (value === 'prediction') {
      return 'prediction';
    }
    return 'analyze';
  };

  let mode: Mode = parseMode(root.dataset.activeMode);
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

  const parsePanelModes = (value: string | undefined): string[] => {
    if (!value) {
      return [];
    }
    return value
      .split(',')
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);
  };

  const updatePanels = (): void => {
    panels.forEach((panel) => {
      const panelModes = parsePanelModes(panel.dataset.modePanel);
      const shouldShow =
        panelModes.length === 0
          ? isAnalysisMode(mode)
          : panelModes.some((panelMode) => {
              if (panelMode === 'analysis') {
                return isAnalysisMode(mode);
              }
              return panelMode === mode;
            });
      panel.toggleAttribute('hidden', !shouldShow);
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

  const formatPercentage = (value: unknown, fractionDigits = 1): string | null => {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value.toFixed(fractionDigits);
    }
    if (typeof value === 'string') {
      const parsed = Number.parseFloat(value);
      if (Number.isFinite(parsed)) {
        return parsed.toFixed(fractionDigits);
      }
    }
    return null;
  };

  const annotationLabels: Record<string, string> = {
    '!!': 'coup brillant',
    '!': 'bon coup',
    '?!': 'coup douteux',
    '?': 'erreur',
    '??': 'bourde',
  };

  const describeAnnotation = (notation: unknown): string | null => {
    if (typeof notation !== 'string') {
      return null;
    }
    const symbol = notation.trim();
    if (!symbol) {
      return null;
    }
    const label = annotationLabels[symbol];
    return label ? `${symbol} - ${label}` : symbol;
  };

  const buildMoveStatusMessage = (payload: any): string | undefined => {
    let move: unknown;
    if (payload && typeof payload === 'object' && 'move' in payload) {
      move = (payload as { move?: unknown }).move;
    }
    if (!move || typeof move !== 'object') {
      return undefined;
    }
    const moveRecord = move as Record<string, unknown>;
    const parts: string[] = [];

    const san = typeof moveRecord.san === 'string' ? moveRecord.san.trim() : '';
    const annotation = describeAnnotation(moveRecord.notation);
    if (san) {
      let headline = `Oracle joue ${san}`;
      if (annotation) {
        headline += ` (${annotation})`;
      }
      parts.push(headline);
    }

    const likelihood = formatPercentage(moveRecord.likelihood, 1);
    if (likelihood) {
      parts.push(`Probabilite estimee: ${likelihood}%`);
    }

    const expectedScore = formatPercentage(moveRecord.win_percentage, 1);
    if (expectedScore) {
      parts.push(`Score attendu: ${expectedScore}%`);
    }

    const breakdown = moveRecord.win_percentage_by_rating;
    if (breakdown && typeof breakdown === 'object') {
      const entries = Object.entries(breakdown as Record<string, unknown>)
        .map(([rating, score]) => {
          const parsedRating = Number.parseInt(rating, 10);
          const parsedScore = (
            typeof score === 'number'
              ? score
              : typeof score === 'string'
              ? Number.parseFloat(score)
              : Number.NaN
          );
          return Number.isInteger(parsedRating) && Number.isFinite(parsedScore)
            ? ([parsedRating, parsedScore] as const)
            : null;
        })
        .filter((entry): entry is readonly [number, number] => entry !== null)
        .sort((a, b) => a[0] - b[0]);

      if (entries.length > 0) {
        const selectedLevel = Number.parseInt(gameState.selectedLevel, 10);
        let hasSelectedSummary = false;
        if (Number.isFinite(selectedLevel)) {
          const matching = entries.find(([rating]) => rating === selectedLevel);
          if (matching) {
            const formatted = formatPercentage(matching[1], 1);
            if (formatted) {
              parts.push(`Score Elo ${matching[0]}: ${formatted}%`);
              hasSelectedSummary = true;
            }
          }
        }

        const [lowest] = entries;
        const [highest] = entries.slice(-1);
        if (lowest) {
          const lowestFormatted = formatPercentage(lowest[1], 1);
          if (highest && highest[0] !== lowest[0]) {
            const highestFormatted = formatPercentage(highest[1], 1);
            if (lowestFormatted && highestFormatted) {
              const label = hasSelectedSummary ? 'Amplitude Elo' : 'Echelle Elo';
              parts.push(
                `${label}: ${lowest[0]} -> ${lowestFormatted}% | ${highest[0]} -> ${highestFormatted}%`,
              );
            } else if (!hasSelectedSummary && lowestFormatted) {
              parts.push(`Score Elo ${lowest[0]}: ${lowestFormatted}%`);
            }
          } else if (!hasSelectedSummary && lowestFormatted) {
            parts.push(`Score Elo ${lowest[0]}: ${lowestFormatted}%`);
          }
        }
      }
    }

    return parts.length > 0 ? parts.join(' - ') : undefined;
  };

  const syncBoardToTextarea = (): void => {
    if (!board || !textarea) {
      return;
    }
    const rawValue = textarea.value.trim();
    withSuppressed(() => {
      if (rawValue.length > 0) {
        const loaded = board!.loadPgn(rawValue);
        if (!loaded) {
          board!.reset();
        }
      } else {
        board!.reset();
      }
    });
    const normalized = board!.getPgn();
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
        const loaded = board!.loadPgn(target);
        if (!loaded) {
          board!.reset();
        }
      } else {
        board!.reset();
      }
    });
    const normalized = board!.getPgn();
    setTextareaValue(normalized);
  };

  const applyServerUpdate = (pgn: string, data: any): void => {
    console.log('[DEBUG] Applying server update with PGN:', pgn, 'data:', data);
    if (!board) {
      return;
    }
    const trimmed = typeof pgn === 'string' ? pgn.trim() : '';
    console.log('[DEBUG] Loading PGN into board, trimmed length:', trimmed.length);
    withSuppressed(() => {
      if (trimmed.length > 0) {
        const loaded = board!.loadPgn(trimmed);
        console.log('[DEBUG] board.loadPgn result:', loaded);
        if (!loaded) {
          console.log('[DEBUG] board.loadPgn failed, resetting board');
          board!.reset();
        }
      } else {
        console.log('[DEBUG] No PGN to load, resetting board');
        board!.reset();
      }
    });
    const normalized = board!.getPgn();
    console.log('[DEBUG] Normalized PGN after load:', normalized);
    gameState.lastStablePgn = normalized;
    setTextareaValue(normalized);

    const finished = Boolean(data?.finished);
    const moveMessage = buildMoveStatusMessage(data);
    const statusText = typeof data?.status === 'string' ? data.status : undefined;
    const fallbackText = typeof data?.message === 'string' ? data.message : undefined;

    let message: string | undefined;
    if (moveMessage && statusText) {
      message = `${moveMessage}\n${statusText}`;
    } else if (moveMessage && fallbackText) {
      message = `${moveMessage}\n${fallbackText}`;
    } else if (moveMessage) {
      message = moveMessage;
    } else if (statusText) {
      message = statusText;
    } else if (fallbackText) {
      message = fallbackText;
    } else if (finished) {
      message = 'Partie terminee.';
    }

    console.log('[DEBUG] Setting status message:', message);
    setStatus(message ?? 'Coup joue.', finished ? 'success' : 'info');

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

    if (analysisModeInput) {
      analysisModeInput.value = isAnalysisMode(mode) ? mode : 'analyze';
    }

    if (isAnalysisMode(mode)) {
      setStatus();
      if (board) {
        syncBoardToTextarea();
      }
      return;
    }

    gameState.inProgress = false;
    gameState.awaitingResponse = false;
    if (board) {
      withSuppressed(() => board!.reset());
      const normalized = board!.getPgn();
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
      const value = input.value === 'play' ? 'play' : input.value === 'prediction' ? 'prediction' : 'analyze';
      setMode(value);
    });
  });

  loadButton?.addEventListener('click', () => {
    if (!isAnalysisMode(mode)) {
      return;
    }
    syncBoardToTextarea();
    textarea?.focus();
  });

  resetButton?.addEventListener('click', () => {
    if (!isAnalysisMode(mode) || !board) {
      return;
    }
    withSuppressed(() => board!.reset());
    const normalized = board!.getPgn();
    setTextareaValue(normalized);
    textarea?.focus();
  });

  playLevelSelect?.addEventListener('change', () => {
    gameState.selectedLevel = playLevelSelect.value?.trim() ?? '';
  });

  const analysisForm = document.querySelector<HTMLFormElement>('form[action="/analyze"]');
  const analysisModeInput = analysisForm?.querySelector<HTMLInputElement>('[data-analysis-mode-input]');
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

  const executeScripts = (container: Element) => {
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
      (script.parentNode as HTMLElement)?.replaceChild(newScript, script);
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
        board!.reset();
        if (typeof data?.pgn === 'string' && data.pgn.trim().length > 0) {
          board!.loadPgn(data.pgn);
        }
      });
      const normalized = board!.getPgn();
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
            board!.loadPgn(data.pgn);
          } else {
            board!.reset();
          }
        });
      }
      const normalized = board!.getPgn();
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

    if (isAnalysisMode(mode)) {
      syncBoardToTextarea();
    } else if (board) {
      withSuppressed(() => board!.reset());
      const normalized = board!.getPgn();
      gameState.lastStablePgn = normalized;
      setTextareaValue(normalized);
      setStatus('Choisissez un niveau puis démarrez une partie.', 'info');
    }

    board?.onMove((payload) => {
      console.log('[DEBUG] Move made in play mode:', payload);
      if (!board || suppress) {
        return;
      }
      if (isAnalysisMode(mode)) {
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
      const playerPgn = board!.getPgn();
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
      console.log('[DEBUG] Sending move request:', requestPayload);
      gameState.awaitingResponse = true;
      updateGameControls();
      boardLoader.hidden = false;
      setStatus('Coup envoyé, attente de la réponse…', 'info');
      postJson(endpoints.move, requestPayload)
        .then((data) => {
          console.log('[DEBUG] Received response:', data);
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
      if (isAnalysisMode(mode)) {
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
  setupResultPageCharts();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onDomReady, { once: true });
} else {
  onDomReady();
}
