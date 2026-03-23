# WENN Feature Pipeline

## Goal
Define how raw market and account data becomes runtime intelligence.

## Pipeline stages
### 1. Ingestion
Collect raw events from:
- candle feeds
- trade/ticker feeds
- order book snapshots
- account balance and position endpoints
- fill/order status endpoints

### 2. Normalization
Convert all inputs into internal contracts with consistent fields and timestamps.

### 3. Derived features
Compute reusable features such as:
- fast / medium / slow moving averages
- ATR and volatility bands
- return windows
- volume ratio
- wick/body structure
- market state hints
- slippage/spread approximations

### 4. Decision features
From the derived layer, prepare features for:
- market state classification
- candidate scoring
- manipulation guardrails
- readiness checks

### 5. Explanation layer
Turn the chosen features into:
- operator brief text
- reason ledger entries
- replay history summaries
- memory statistics

## Strong v1 feature set
### Market structure
- EMA alignment
- ATR
- recent return
- volume ratio
- feed freshness

### Execution realism
- spread estimate
- order book imbalance summary
- fill/update status snapshots

### Reporting truth
- real balance snapshots
- position state
- fill-derived PnL

## What should stay secondary in early versions
- social sentiment
- noisy news scraping
- broad multi-asset blending
- heavy black-box feature explosion

## WENN design rule
Each feature must justify its existence by improving:
- decision clarity
- risk control
- execution realism
- reporting truth

## One-line principle
**WENN should transform raw data into a small number of high-value features, not a mess of weak signals.**
