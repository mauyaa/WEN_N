export interface OHLCVCandle {
  symbol: string;
  timeframe: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OrderBookSnapshot {
  symbol: string;
  timestamp: number;
  bestBid: number;
  bestAsk: number;
  bidVolume: number;
  askVolume: number;
}

export interface AccountSnapshot {
  source: 'exchange' | 'wallet' | 'simulated';
  timestamp: number;
  totalEquity: number;
  availableBalance: number;
  usedMargin: number;
}

export interface PositionSnapshot {
  symbol: string;
  side: 'LONG' | 'SHORT';
  size: number;
  entryPrice: number;
  markPrice: number;
  unrealizedPnl: number;
  timestamp: number;
}

export interface FillSnapshot {
  orderId: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  price: number;
  quantity: number;
  fee?: number;
  timestamp: number;
}

export interface NormalizedMarketBundle {
  candles: OHLCVCandle[];
  orderBook?: OrderBookSnapshot;
  account?: AccountSnapshot;
  positions?: PositionSnapshot[];
  fills?: FillSnapshot[];
}
