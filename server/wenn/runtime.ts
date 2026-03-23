import { nextStateOrThrow } from './stateMachine';
import { CandidateSignal, FeatureSnapshot, MarketState, RuntimeState, RuntimeStatus } from './types';

export function classifyMarketState(snapshot: FeatureSnapshot): MarketState {
  if (!snapshot.websocketHealthy || snapshot.feedFreshnessMs > 5000) {
    return 'invalid';
  }

  if (snapshot.atr > snapshot.lastPrice * 0.025) {
    return 'high_volatility';
  }

  if (snapshot.emaFast > snapshot.emaMedium && snapshot.emaMedium > snapshot.emaSlow) {
    return 'trend_up';
  }

  if (snapshot.emaFast < snapshot.emaMedium && snapshot.emaMedium < snapshot.emaSlow) {
    return 'trend_down';
  }

  return 'range';
}

export function buildCandidateSignal(snapshot: FeatureSnapshot): CandidateSignal {
  const marketState = classifyMarketState(snapshot);

  if (marketState === 'invalid') {
    return {
      symbol: 'BTCUSDT',
      generatedAt: new Date().toISOString(),
      marketState,
      action: 'pause_system',
      confidence: 0,
      reasons: ['feed_unhealthy'],
      warnings: ['runtime_should_pause'],
    };
  }

  if (marketState === 'trend_up' && snapshot.recentReturn > -0.01 && snapshot.volumeRatio >= 0.9) {
    return {
      symbol: 'BTCUSDT',
      generatedAt: new Date().toISOString(),
      marketState,
      action: 'paper_long_candidate',
      confidence: 0.68,
      reasons: ['higher_timeframe_alignment', 'controlled_pullback', 'healthy_volume_context'],
      warnings: [],
    };
  }

  return {
    symbol: 'BTCUSDT',
    generatedAt: new Date().toISOString(),
    marketState,
    action: 'wait',
    confidence: 0.25,
    reasons: ['no_clean_candidate'],
    warnings: [],
  };
}

export function evaluateNextRuntimeState(
  currentState: RuntimeState,
  signal: CandidateSignal,
): RuntimeState {
  switch (signal.action) {
    case 'pause_system':
      return nextStateOrThrow(currentState, 'PAUSE');
    case 'paper_long_candidate':
    case 'paper_short_candidate':
      return currentState === 'SCAN'
        ? nextStateOrThrow(currentState, 'ARMED')
        : currentState;
    case 'wait':
      return currentState === 'SCAN'
        ? nextStateOrThrow(currentState, 'WAIT')
        : currentState;
    default:
      return currentState;
  }
}

export function buildRuntimeStatus(
  state: RuntimeState,
  marketState: MarketState,
  note: string,
): RuntimeStatus {
  return {
    state,
    marketState,
    updatedAt: new Date().toISOString(),
    healthy: state !== 'PAUSE' && state !== 'STOP',
    note,
  };
}
