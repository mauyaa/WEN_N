import { CandleObservationReport, CandleObservationRequest } from './aiObserverContracts';

function detectMomentum(closes: number[]): 'bullish' | 'bearish' | 'neutral' {
  if (closes.length < 3) return 'neutral';
  const change = closes[closes.length - 1] - closes[0];
  if (change > 0) return 'bullish';
  if (change < 0) return 'bearish';
  return 'neutral';
}

function detectVolatility(highs: number[], lows: number[]): 'compressed' | 'normal' | 'expanded' {
  if (highs.length === 0 || lows.length === 0) return 'normal';
  const range = Math.max(...highs) - Math.min(...lows);
  if (range < 100) return 'compressed';
  if (range > 800) return 'expanded';
  return 'normal';
}

function detectStructure(bodies: number[], wicks: number[]): 'orderly' | 'mixed' | 'chaotic' {
  if (bodies.length === 0 || wicks.length === 0) return 'mixed';
  const avgBody = bodies.reduce((a, b) => a + b, 0) / bodies.length;
  const avgWick = wicks.reduce((a, b) => a + b, 0) / wicks.length;
  if (avgWick > avgBody * 2) return 'chaotic';
  if (avgBody > 0 && avgWick < avgBody * 1.2) return 'orderly';
  return 'mixed';
}

export function observeCandles(request: CandleObservationRequest): CandleObservationReport {
  const candles = request.candles;
  const closes = candles.map((c) => c.close);
  const highs = candles.map((c) => c.high);
  const lows = candles.map((c) => c.low);
  const bodies = candles.map((c) => Math.abs(c.close - c.open));
  const wicks = candles.map((c) => Math.abs(c.high - Math.max(c.open, c.close)) + Math.abs(Math.min(c.open, c.close) - c.low));

  const momentumLabel = detectMomentum(closes);
  const volatilityLabel = detectVolatility(highs, lows);
  const structureLabel = detectStructure(bodies, wicks);

  const observations: string[] = [];
  const warnings: string[] = [];

  observations.push(`Momentum appears ${momentumLabel}.`);
  observations.push(`Volatility looks ${volatilityLabel}.`);
  observations.push(`Candle structure appears ${structureLabel}.`);

  if (structureLabel === 'chaotic') {
    warnings.push('Candle behavior is noisy and may reduce pattern reliability.');
  }

  if (volatilityLabel === 'expanded') {
    warnings.push('Expanded volatility suggests caution with tight invalidation assumptions.');
  }

  const summary = `WENN AI observer sees a ${structureLabel} market with ${momentumLabel} pressure and ${volatilityLabel} volatility.`;

  return {
    symbol: request.symbol,
    timeframe: request.timeframe,
    summary,
    structureLabel,
    momentumLabel,
    volatilityLabel,
    confidence: structureLabel === 'mixed' ? 0.58 : 0.68,
    observations,
    warnings,
  };
}
