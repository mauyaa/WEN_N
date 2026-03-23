import {
  BalanceSnapshot,
  ConnectedAccount,
  LiveFillSnapshot,
  LivePositionSnapshot,
  OrderSnapshot,
  PlaceOrderRequest,
} from './exchangeContracts';
import { ExchangeAdapter } from './exchangeAdapter';
import { executePaperOrder } from './paperExecution';
import { getPaperBalances, getPaperFills, getPaperOrders, getPaperPositions, setPaperOrders } from './paperState';

export class StatefulPaperExchangeAdapter implements ExchangeAdapter {
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
    return getPaperBalances();
  }

  async getOpenOrders(symbol?: string): Promise<OrderSnapshot[]> {
    return getPaperOrders().filter((o) => (symbol ? o.symbol === symbol : true) && ['NEW', 'PARTIALLY_FILLED'].includes(o.status));
  }

  async getOpenPositions(symbol?: string): Promise<LivePositionSnapshot[]> {
    return getPaperPositions().filter((p) => (symbol ? p.symbol === symbol : true));
  }

  async getRecentFills(symbol?: string): Promise<LiveFillSnapshot[]> {
    return getPaperFills().filter((f) => (symbol ? f.symbol === symbol : true));
  }

  async placeOrder(request: PlaceOrderRequest): Promise<OrderSnapshot> {
    return executePaperOrder(request);
  }

  async cancelOrder(orderId: string, symbol: string): Promise<OrderSnapshot> {
    const orders = getPaperOrders();
    const idx = orders.findIndex((o) => o.orderId === orderId && o.symbol === symbol);

    if (idx === -1) {
      return {
        orderId,
        symbol,
        side: 'BUY',
        type: 'LIMIT',
        status: 'REJECTED',
        quantity: 0,
        filledQuantity: 0,
        timestamp: Date.now(),
      };
    }

    orders[idx] = {
      ...orders[idx],
      status: 'CANCELED',
      timestamp: Date.now(),
    };
    setPaperOrders(orders);
    return orders[idx];
  }
}
