import { LiveFillSnapshot, LivePositionSnapshot, OrderSnapshot, PlaceOrderRequest } from './exchangeContracts';
import {
  getPaperBalances,
  getPaperFills,
  getPaperOrders,
  getPaperPositions,
  setPaperBalances,
  setPaperFills,
  setPaperOrders,
  setPaperPositions,
} from './paperState';

const DEFAULT_MARK_PRICE = 65000;

function updateBalance(asset: string, deltaFree: number) {
  const balances = getPaperBalances();
  const idx = balances.findIndex((b) => b.asset === asset);
  if (idx === -1) return;
  balances[idx] = {
    ...balances[idx],
    free: balances[idx].free + deltaFree,
    total: balances[idx].total + deltaFree,
    timestamp: Date.now(),
  };
  setPaperBalances(balances);
}

function upsertLongPosition(symbol: string, quantity: number, price: number) {
  const positions = getPaperPositions();
  const idx = positions.findIndex((p) => p.symbol === symbol && p.side === 'LONG');

  if (idx === -1) {
    positions.push({
      symbol,
      side: 'LONG',
      size: quantity,
      entryPrice: price,
      markPrice: DEFAULT_MARK_PRICE,
      unrealizedPnl: (DEFAULT_MARK_PRICE - price) * quantity,
      timestamp: Date.now(),
    });
  } else {
    const current = positions[idx];
    const newSize = current.size + quantity;
    const weightedEntry = (current.entryPrice * current.size + price * quantity) / newSize;
    positions[idx] = {
      ...current,
      size: newSize,
      entryPrice: weightedEntry,
      markPrice: DEFAULT_MARK_PRICE,
      unrealizedPnl: (DEFAULT_MARK_PRICE - weightedEntry) * newSize,
      timestamp: Date.now(),
    };
  }

  setPaperPositions(positions);
}

function reduceLongPosition(symbol: string, quantity: number, price: number) {
  const positions = getPaperPositions();
  const idx = positions.findIndex((p) => p.symbol === symbol && p.side === 'LONG');
  if (idx === -1) return;

  const current = positions[idx];
  const nextSize = Math.max(0, current.size - quantity);

  if (nextSize === 0) {
    positions.splice(idx, 1);
  } else {
    positions[idx] = {
      ...current,
      size: nextSize,
      markPrice: DEFAULT_MARK_PRICE,
      unrealizedPnl: (DEFAULT_MARK_PRICE - current.entryPrice) * nextSize,
      timestamp: Date.now(),
    };
  }

  setPaperPositions(positions);

  const realized = (price - current.entryPrice) * Math.min(quantity, current.size);
  updateBalance('USDT', realized);
}

function appendFill(fill: LiveFillSnapshot) {
  const fills = getPaperFills();
  fills.unshift(fill);
  setPaperFills(fills.slice(0, 50));
}

function appendOrder(order: OrderSnapshot) {
  const orders = getPaperOrders();
  orders.unshift(order);
  setPaperOrders(orders.slice(0, 50));
}

export function executePaperOrder(request: PlaceOrderRequest): OrderSnapshot {
  const timestamp = Date.now();
  const price = request.price ?? DEFAULT_MARK_PRICE;
  const quantity = request.quantity;

  const order: OrderSnapshot = {
    orderId: request.clientOrderId || `paper-${timestamp}`,
    symbol: request.symbol,
    side: request.side,
    type: request.type,
    status: 'FILLED',
    quantity,
    filledQuantity: quantity,
    price: request.price,
    averageFillPrice: price,
    timestamp,
  };

  if (request.side === 'BUY') {
    updateBalance('USDT', -(price * quantity));
    updateBalance('BTC', quantity);
    upsertLongPosition(request.symbol, quantity, price);
  } else {
    updateBalance('USDT', price * quantity);
    updateBalance('BTC', -quantity);
    reduceLongPosition(request.symbol, quantity, price);
  }

  appendFill({
    orderId: order.orderId,
    fillId: `fill-${timestamp}`,
    symbol: request.symbol,
    side: request.side,
    price,
    quantity,
    fee: 0,
    timestamp,
  });

  appendOrder(order);
  return order;
}
