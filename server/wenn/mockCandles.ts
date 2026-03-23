import { OHLCVCandle } from './dataContracts';

export function createMockCandles(symbol = 'BTCUSDT', timeframe = '1h', count = 24): OHLCVCandle[] {
  const candles: OHLCVCandle[] = [];
  let lastClose = 65000;
  const now = Date.now();
  const stepMs = timeframe === '1h' ? 60 * 60 * 1000 : 5 * 60 * 1000;

  for (let i = count; i > 0; i--) {
    const timestamp = now - i * stepMs;
    const drift = (Math.random() - 0.48) * 220;
    const open = lastClose;
    const close = Math.max(1000, open + drift);
    const high = Math.max(open, close) + Math.random() * 90;
    const low = Math.min(open, close) - Math.random() * 90;
    const volume = 100 + Math.random() * 400;

    candles.push({
      symbol,
      timeframe,
      timestamp,
      open,
      high,
      low,
      close,
      volume,
    });

    lastClose = close;
  }

  return candles;
}
