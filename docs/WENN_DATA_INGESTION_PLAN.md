# WENN Data Ingestion Plan

## Goal
Turn WENN into a data-disciplined system that can learn from structured market inputs without pretending that every feed is equally useful.

## Principle
WENN should ingest in layers.
Do not feed everything at once.
Feed the highest-signal data first, prove value, then expand.

## Phase 1 — Core BTC market data
### Required
- OHLCV candles
- live trade ticks or ticker stream
- book snapshots or top-of-book state
- funding/open interest when available

### Purpose
This is the base layer for:
- market state classification
- volatility detection
- trend structure
- pullback quality
- execution realism

## Phase 2 — Exchange/account truth
### Required
- account balances
- available margin
- open orders
- fills
- open positions
- realized / unrealized PnL

### Purpose
This is the source of truth for:
- real exposure
- profit reporting
- position reconciliation
- live readiness

## Phase 3 — Advanced context
### Optional after core stability
- sentiment datasets
- on-chain metrics
- macro event calendar
- wallet flow summaries

### Purpose
These feeds should help WENN explain context, not override the core market engine.

## Storage tiers
### Raw
Store raw feeds for replay and debugging.

### Normalized
Convert all feeds into consistent internal contracts.

### Features
Compute indicators and derived signals from normalized data.

### Runtime memory
Store cycle history, readiness state, and explanation snapshots.

## File formats
### Best practical options
- CSV for quick inspection and portability
- JSON for snapshots and structured events
- Parquet later for larger research datasets

## v1 recommendation
Start with BTC-only normalized feeds:
- candles
- top-of-book or book snapshot
- account state
- fills

Do not let sentiment or on-chain data dominate the first live-grade version.

## WENN rule
A feed is only useful if it improves one of these:
- state quality
- execution quality
- risk quality
- reporting truth

## One-line principle
**WENN should be fed in layers, not flooded with noise.**
