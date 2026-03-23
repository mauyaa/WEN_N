import { OHLCVCandle } from './dataContracts';
import { PatternContextBundle, PatternMatch } from './patternContracts';

function buildBullishEngulfing(candles: OHLCVCandle[]): PatternMatch | undefined {
  if (candles.length < 2) return undefined;

  const prev = candles[candles.length - 2];
  const curr = candles[candles.length - 1];

  const prevBearish = prev.close < prev.open;
  const currBullish = curr.close > curr.open;
  const engulfed = curr.open <= prev.close && curr.close >= prev.open;

  if (!prevBearish || !currBullish || !engulfed) return undefined;

  return {
    type: 'bullish_engulfing',
    direction: 'bullish',
    symbol: curr.symbol,
    timeframe: curr.timeframe,
    timestamp: curr.timestamp,
    confidence: 0.68,
    reasons: ['previous_candle_bearish', 'current_candle_bullish', 'real_body_engulfed'],
  };
}

function buildBearishEngulfing(candles: OHLCVCandle[]): PatternMatch | undefined {
  if (candles.length < 2) return undefined;

  const prev = candles[candles.length - 2];
  const curr = candles[candles.length - 1];

  const prevBullish = prev.close > prev.open;
  const currBearish = curr.close < curr.open;
  const engulfed = curr.open >= prev.close && curr.close <= prev.open;

  if (!prevBullish || !currBearish || !engulfed) return undefined;

  return {
    type: 'bearish_engulfing',
    direction: 'bearish',
    symbol: curr.symbol,
    timeframe: curr.timeframe,
    timestamp: curr.timestamp,
    confidence: 0.68,
    reasons: ['previous_candle_bullish', 'current_candle_bearish', 'real_body_engulfed'],
  };
}

export function detectPrimaryPattern(candles: OHLCVCandle[]): PatternMatch | undefined {
  return buildBullishEngulfing(candles) ?? buildBearishEngulfing(candles);
}

export function buildPatternContextBundle(candles: OHLCVCandle[]): PatternContextBundle {
  const latest = candles[candles.length - 1];
  const pattern = detectPrimaryPattern(candles);

  return {
    symbol: latest?.symbol || 'BTCUSDT',
    timeframe: latest?.timeframe || '5m',
    pattern,
    volumeRatio: undefined,
    marketState: undefined,
    guardrailBlocked: false,
  };
}
