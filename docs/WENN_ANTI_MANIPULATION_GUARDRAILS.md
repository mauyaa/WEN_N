# WENN Anti-Manipulation Guardrails

## Purpose
These guardrails help WENN stay defensive in BTC-first paper mode.

The goal is not to claim immunity.
The goal is to reduce exposure to low-quality or distorted conditions.

## Principle
WENN should avoid acting when the market looks engineered, unstable, or structurally unclear.

## Conditions WENN should distrust
- abnormal wick-heavy candles
- sudden volume bursts without clean displacement
- extreme volatility spikes
- stale or inconsistent feed health
- fast reversals after directional expansion
- multi-timeframe disagreement

## Guardrail categories
### 1. Wick trap environment
If recent candles show long upper or lower wicks with weak bodies, WENN should treat the area as unstable.

### 2. Suspicious volume context
If relative volume spikes sharply but price displacement stays weak or inconsistent, WENN should assume the move is low quality.

### 3. Disorderly volatility
If ATR expands too quickly relative to price, WENN should prefer `WAIT` or `PAUSE`.

### 4. Feed unreliability
If market data freshness degrades or required snapshots are missing, WENN should block all new action.

### 5. Fast reversal behavior
If momentum flips too quickly after expansion, WENN should avoid chasing.

## Required response
When anti-manipulation guardrails trigger, WENN should:
- block new candidate actions
- write the reason to the journal
- stay in `WAIT` or move to `PAUSE`
- refuse to escalate confidence

## Rule of discipline
A system that reacts to every dramatic move becomes easy to fool.
WENN should be strongest when it becomes more patient under suspicious conditions.
