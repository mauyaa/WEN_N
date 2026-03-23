import { LiveFillSnapshot, LivePositionSnapshot, OrderSnapshot } from './exchangeContracts';

export interface ReconciliationResult {
  orderMismatches: string[];
  positionMismatches: string[];
  fillMismatches: string[];
  healthy: boolean;
}

export function reconcileLiveState(params: {
  localOrders: OrderSnapshot[];
  exchangeOrders: OrderSnapshot[];
  localPositions: LivePositionSnapshot[];
  exchangePositions: LivePositionSnapshot[];
  localFills: LiveFillSnapshot[];
  exchangeFills: LiveFillSnapshot[];
}): ReconciliationResult {
  const orderMismatches: string[] = [];
  const positionMismatches: string[] = [];
  const fillMismatches: string[] = [];

  const localOrderIds = new Set(params.localOrders.map((o) => o.orderId));
  const exchangeOrderIds = new Set(params.exchangeOrders.map((o) => o.orderId));

  for (const id of exchangeOrderIds) {
    if (!localOrderIds.has(id)) {
      orderMismatches.push(`missing_local_order:${id}`);
    }
  }

  const localPositionSymbols = new Set(params.localPositions.map((p) => `${p.symbol}:${p.side}`));
  const exchangePositionSymbols = new Set(params.exchangePositions.map((p) => `${p.symbol}:${p.side}`));

  for (const key of exchangePositionSymbols) {
    if (!localPositionSymbols.has(key)) {
      positionMismatches.push(`missing_local_position:${key}`);
    }
  }

  const localFillKeys = new Set(params.localFills.map((f) => `${f.orderId}:${f.timestamp}:${f.quantity}`));
  const exchangeFillKeys = new Set(params.exchangeFills.map((f) => `${f.orderId}:${f.timestamp}:${f.quantity}`));

  for (const key of exchangeFillKeys) {
    if (!localFillKeys.has(key)) {
      fillMismatches.push(`missing_local_fill:${key}`);
    }
  }

  return {
    orderMismatches,
    positionMismatches,
    fillMismatches,
    healthy: orderMismatches.length === 0 && positionMismatches.length === 0 && fillMismatches.length === 0,
  };
}
