import {
  BalanceSnapshot,
  ConnectedAccount,
  LiveFillSnapshot,
  LivePositionSnapshot,
  OrderSnapshot,
  PlaceOrderRequest,
} from './exchangeContracts';

export interface ExchangeAdapter {
  provider: string;
  connect(): Promise<ConnectedAccount>;
  getBalances(): Promise<BalanceSnapshot[]>;
  getOpenOrders(symbol?: string): Promise<OrderSnapshot[]>;
  getOpenPositions(symbol?: string): Promise<LivePositionSnapshot[]>;
  getRecentFills(symbol?: string): Promise<LiveFillSnapshot[]>;
  placeOrder(request: PlaceOrderRequest): Promise<OrderSnapshot>;
  cancelOrder(orderId: string, symbol: string): Promise<OrderSnapshot>;
}
