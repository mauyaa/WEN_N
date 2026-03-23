export type RuntimeState =
  | 'BOOT'
  | 'SCAN'
  | 'WAIT'
  | 'ARMED'
  | 'MANAGE'
  | 'COOLDOWN'
  | 'PAUSE'
  | 'STOP';

export type MarketState =
  | 'trend_up'
  | 'trend_down'
  | 'range'
  | 'breakout_building'
  | 'high_volatility'
  | 'invalid';

export type SignalAction =
  | 'wait'
  | 'paper_long_candidate'
  | 'paper_short_candidate'
  | 'hold_simulated_position'
  | 'reduce_simulated_position'
  | 'exit_simulated_position'
  | 'pause_system';

export interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface FeatureSnapshot {
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

export interface CandidateSignal {
  symbol: 'BTCUSDT';
  generatedAt: string;
  marketState: MarketState;
  action: SignalAction;
  confidence: number;
  reasons: string[];
  warnings: string[];
}

export interface RuntimeStatus {
  state: RuntimeState;
  marketState: MarketState;
  updatedAt: string;
  healthy: boolean;
  note: string;
}
