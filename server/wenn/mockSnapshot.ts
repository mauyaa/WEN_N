import { FeatureSnapshot } from './types';

export function createMockBtcSnapshot(): FeatureSnapshot {
  const lastPrice = 65000 + (Math.random() - 0.5) * 250;
  const emaMedium = lastPrice - 45;
  const emaFast = emaMedium + 20;
  const emaSlow = emaMedium - 60;

  return {
    symbol: 'BTCUSDT',
    generatedAt: new Date().toISOString(),
    lastPrice,
    emaFast,
    emaMedium,
    emaSlow,
    atr: 900 + Math.random() * 350,
    recentReturn: -0.008 + Math.random() * 0.016,
    volumeRatio: 0.8 + Math.random() * 2.2,
    feedFreshnessMs: Math.floor(250 + Math.random() * 1800),
    websocketHealthy: true,
  };
}
