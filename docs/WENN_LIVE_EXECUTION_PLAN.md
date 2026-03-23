# WENN Live Execution Plan

## Goal
Move WENN from a research-grade console into a truthful live trading system.

## Principle
Live trading is complete only when the product can prove:
- who the connected account is
- what balances are actually available
- what orders were actually placed
- what fills actually occurred
- what positions are actually open
- what realized and unrealized PnL actually exists

## Live layer phases
### Phase 1 — Account truth
Required:
- authenticated exchange adapter
- account identity snapshot
- balance snapshot
- available balance / margin snapshot
- open orders snapshot
- open positions snapshot

### Phase 2 — Order lifecycle truth
Required:
- place order request
- accept or reject response handling
- order status polling or websocket updates
- cancel/replace handling
- partial-fill handling
- failure logging

### Phase 3 — Fill and position reconciliation
Required:
- durable fill records
- position updates from exchange source of truth
- realized / unrealized PnL calculation from real fills and marks
- reconciliation pass to detect mismatches between local and exchange state

### Phase 4 — Live safety
Required:
- kill switch
- daily drawdown stop
- stale data circuit breaker
- credential validation
- explicit live-mode enable flag
- operator confirmation and logging for live activation

## Recommended order of implementation
1. exchange adapter contracts
2. account snapshot and balance truth
3. order request / response contracts
4. fill and position storage
5. reconciliation service
6. live-only risk gates
7. UI truth panels for connected account, orders, fills, and PnL

## Product rule
WENN must never show simulated balances, orders, or profits inside a live-mode surface.

## One-line principle
**A live trading system is only real when account state, execution, fills, and PnL are all reconciled to an external source of truth.**
