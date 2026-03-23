import { observeCandles } from './aiObserver';
import { CandleObservationReport } from './aiObserverContracts';
import { createMockCandles } from './mockCandles';
import { buildPatternContextBundle } from './patternEngine';
import { PatternContextBundle } from './patternContracts';

export interface ResearchInsightsReport {
  observation: CandleObservationReport;
  patternContext: PatternContextBundle;
  note: string;
}

export function buildResearchInsightsReport(): ResearchInsightsReport {
  const candles = createMockCandles('BTCUSDT', '1h', 24);
  const observation = observeCandles({
    symbol: 'BTCUSDT',
    timeframe: '1h',
    candles,
  });
  const patternContext = buildPatternContextBundle(candles);

  const note = patternContext.pattern
    ? `Pattern context detected: ${patternContext.pattern.type}.`
    : 'No primary engulfing context detected in the latest research window.';

  return {
    observation,
    patternContext,
    note,
  };
}
