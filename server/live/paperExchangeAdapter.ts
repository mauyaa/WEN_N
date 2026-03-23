import {
  BalanceSnapshot,
  ConnectedAccount,
  LiveFillSnapshot,
  LivePositionSnapshot,
  OrderSnapshot,
  PlaceOrderRequest,
} from './exchangeContracts';
import { ExchangeAdapter } from './exchangeAdapter';

export class PaperExchangeAdapter implements ExchangeAdapter {
  provider = 'paper';

  async connect(): Promise<ConnectedAccount> {
    return {
      provider: this.provider,
      accountId: 'paper-account',
      label: 'WENN Paper Account',
      timestamp: Date.now(),
    };
  }

  async getBalances(): Promise<BalanceSnapshot[]> {
    return [
      {
        asset: 'USDT',
        free: 1000,
        locked: 0,
        total: 1000,
        timestamp: Date.now(),
      },
      {
        asset: 'BTC',
        free: 0,
        locked: 0,
        total: 0,
        timestamp: Date.now(),
      },
    ];
  }

  async getOpenOrders(_symbol?: string): Promise<OrderSnapshot[]> {
    return [];
  }

  async getOpenPositions(_symbol?: string): Promise<LivePositionSnapshot[]> {
    return [];
  }

  async getRecentFills(_symbol?: string): Promise<LiveFillSnapshot[]> {
    return [];
  }

  async placeOrder(request: PlaceOrderRequest): Promise<OrderSnapshot> {
    return {
      orderId: `paper-${Date.now()}`,
      symbol: request.symbol,
      side: request.side,
      type: request.type,
      status: 'FILLED',
      quantity: request.quantity,
      filledQuantity: request.quantity,
      price: request.price,
      averageFillPrice: request.price,
      timestamp: Date.now(),
    };
  }

  async cancelOrder(orderId: string, symbol: string): Promise<OrderSnapshot> {
    return {
      orderId,
      symbol,
      side: 'BUY',
      type: 'LIMIT',
      status: 'CANCELED',
      quantity: 0,
      filledQuantity: 0,
      timestamp: Date.now(),
    };
  }
}
