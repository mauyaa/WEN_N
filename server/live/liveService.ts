import { ExchangeAdapter } from './exchangeAdapter';
import { PaperExchangeAdapter } from './paperExchangeAdapter';

export interface LiveSnapshotReport {
  account: Awaited<ReturnType<ExchangeAdapter['connect']>>;
  balances: Awaited<ReturnType<ExchangeAdapter['getBalances']>>;
  openOrders: Awaited<ReturnType<ExchangeAdapter['getOpenOrders']>>;
  openPositions: Awaited<ReturnType<ExchangeAdapter['getOpenPositions']>>;
  recentFills: Awaited<ReturnType<ExchangeAdapter['getRecentFills']>>;
  provider: string;
  mode: 'paper';
}

function getDefaultAdapter(): ExchangeAdapter {
  return new PaperExchangeAdapter();
}

export async function getLiveSnapshotReport(): Promise<LiveSnapshotReport> {
  const adapter = getDefaultAdapter();
  const [account, balances, openOrders, openPositions, recentFills] = await Promise.all([
    adapter.connect(),
    adapter.getBalances(),
    adapter.getOpenOrders('BTCUSDT'),
    adapter.getOpenPositions('BTCUSDT'),
    adapter.getRecentFills('BTCUSDT'),
  ]);

  return {
    account,
    balances,
    openOrders,
    openPositions,
    recentFills,
    provider: adapter.provider,
    mode: 'paper',
  };
}
