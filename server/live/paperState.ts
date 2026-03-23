import { BalanceSnapshot, LiveFillSnapshot, LivePositionSnapshot, OrderSnapshot } from './exchangeContracts';

const now = () => Date.now();

let balances: BalanceSnapshot[] = [
  { asset: 'USDT', free: 1000, locked: 0, total: 1000, timestamp: now() },
  { asset: 'BTC', free: 0, locked: 0, total: 0, timestamp: now() },
];

let orders: OrderSnapshot[] = [];
let positions: LivePositionSnapshot[] = [];
let fills: LiveFillSnapshot[] = [];

export function getPaperBalances(): BalanceSnapshot[] {
  return balances.map((b) => ({ ...b }));
}

export function setPaperBalances(next: BalanceSnapshot[]) {
  balances = next.map((b) => ({ ...b, timestamp: now() }));
}

export function getPaperOrders(): OrderSnapshot[] {
  return orders.map((o) => ({ ...o }));
}

export function setPaperOrders(next: OrderSnapshot[]) {
  orders = next.map((o) => ({ ...o }));
}

export function getPaperPositions(): LivePositionSnapshot[] {
  return positions.map((p) => ({ ...p }));
}

export function setPaperPositions(next: LivePositionSnapshot[]) {
  positions = next.map((p) => ({ ...p }));
}

export function getPaperFills(): LiveFillSnapshot[] {
  return fills.map((f) => ({ ...f }));
}

export function setPaperFills(next: LiveFillSnapshot[]) {
  fills = next.map((f) => ({ ...f }));
}
