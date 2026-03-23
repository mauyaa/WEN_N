export type WennRuntimeState =
  | 'BOOT'
  | 'SCAN'
  | 'WAIT'
  | 'ARMED'
  | 'MANAGE'
  | 'COOLDOWN'
  | 'PAUSE'
  | 'STOP';

export type WennMarketState =
  | 'trend_up'
  | 'trend_down'
  | 'range'
  | 'breakout_building'
  | 'high_volatility'
  | 'invalid';

export type WennSignalAction =
  | 'wait'
  | 'paper_long_candidate'
  | 'paper_short_candidate'
  | 'hold_simulated_position'
  | 'reduce_simulated_position'
  | 'exit_simulated_position'
  | 'pause_system';

export interface WennRuntimeStatus {
  state: WennRuntimeState;
  marketState: WennMarketState;
  updatedAt: string;
  healthy: boolean;
  note: string;
}

export interface WennCandidateSignal {
  symbol: 'BTCUSDT';
  generatedAt: string;
  marketState: WennMarketState;
  action: WennSignalAction;
  confidence: number;
  reasons: string[];
  warnings: string[];
}

export interface WennFeatureSnapshot {
  symbol: 'BTCUSDT';
  generatedAt: string;
  lastPrice: number;
  emaFast: number;
  emaMedium: number;
  emaSlow: number;
  atr: number;
  recentReturn: number;
  volumeRatio: number;
  feedFreshnessMs: number;
  websocketHealthy: boolean;
}

export interface WennRuntimeCycle {
  snapshot: WennFeatureSnapshot;
  signal: WennCandidateSignal;
  status: WennRuntimeStatus;
  guardrailReasons: string[];
}

const baseUrl = '/api/wenn';

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`);

  if (!response.ok) {
    throw new Error(`WENN API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getWennStatus(): Promise<{ status: WennRuntimeStatus }> {
  return fetchJson<{ status: WennRuntimeStatus }>('/status');
}

export async function getWennCycle(): Promise<WennRuntimeCycle> {
  return fetchJson<WennRuntimeCycle>('/cycle');
}
