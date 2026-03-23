# WENN Realtime Readiness

## Purpose
This document states, plainly, which parts of WENN are currently realtime, which parts are simulated, and what must be completed before live account operation is truthful.

## Current state
### Already realtime or near-realtime
- frontend market price updates when connected to live exchange streams
- Firestore snapshot-based updates for user, positions, and history views
- WENN runtime polling and recent-cycle replay surfaces

### Simulated or research-only
- deposit confirmation flow
- balance top-up flow
- mock BTC runtime snapshot generation
- paper-candidate generation
- placeholder trading API routes
- app-side position lifecycle not reconciled to a real exchange account

## What must be true before calling WENN live
### 1. Funding reality
- real deposit address or exchange funding flow
- real account selection
- real wallet or exchange credential validation
- clear source of truth for balances

### 2. Execution reality
- authenticated exchange adapter
- order placement response handling
- order status polling or websocket reconciliation
- fills written to durable storage
- position state reconciled against exchange state

### 3. Reporting reality
- open positions from real exchange data
- realized and unrealized PnL from real fills and marks
- rejected/cancelled/partially filled order visibility
- account-level equity and available margin from real account data

### 4. Safety reality
- kill switch
- circuit breaker for stale feeds
- per-trade and daily risk limits
- explicit live-mode flag separate from research mode

## Product truth standard
WENN should never describe a capability as live when it is still simulated.

## Immediate priority
Build a visible readiness layer so the UI can say:
- what is connected
- what is research-only
- what still blocks live operation

## One-line rule
**WENN earns the word realtime only when deposits, account state, execution, and reporting all come from a real connected source of truth.**
