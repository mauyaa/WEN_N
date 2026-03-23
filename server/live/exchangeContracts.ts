export interface ConnectedAccount {
  provider: string;
  accountId: string;
  label?: string;
  timestamp: number;
}

export interface BalanceSnapshot {
  asset: string;
  free: number;
  locked: number;
  total: number;
  timestamp: number;
}

export interface PlaceOrderRequest {
  symbol: string;
  side: 'BUY' | 'SELL';
  type: 'MARKET' | 'LIMIT';
  quantity: number;
  price?: number;
  clientOrderId?: string;
}

export interface OrderSnapshot {
  orderId: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  type: 'MARKET' | 'LIMIT';
  status: 'NEW' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELED' | 'REJECTED';
  quantity: number;
  filledQuantity: number;
  price?: number;
  averageFillPrice?: number;
  timestamp: number;
}

export interface LiveFillSnapshot {
  orderId: string;
  fillId?: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  price: number;
  quantity: number;
  fee?: number;
  timestamp: number;
}

export interface LivePositionSnapshot {
  symbol: string;
  side: 'LONG' | 'SHORT';
  size: number;
  entryPrice: number;
  markPrice: number;
  unrealizedPnl: number;
  timestamp: number;
}
