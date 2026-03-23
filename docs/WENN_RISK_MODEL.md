# WENN Risk Model

## Purpose
This document defines the guardrails that make WENN stable, selective, and maintainable in BTC-first paper mode.

## Philosophy
The goal is not to predict perfectly.
The goal is to avoid low-quality conditions, limit noise, and keep the system interpretable.

## Non-negotiables
- no action when data health is poor
- no duplicate candidate spam
- one tracked opportunity at a time in v1
- cooldown after invalidation or completion
- immediate pause when system health becomes unreliable

## Guardrail categories
### 1. Data health
Block new actions when:
- websocket is disconnected
- candle history is incomplete
- feed freshness exceeds threshold
- required timeframe snapshot is missing

### 2. Structure quality
Block new actions when:
- higher-timeframe bias is mixed
- volatility is extreme
- expected structure is too noisy
- confidence is below threshold

### 3. System behavior
Pause or cool down when:
- repeated duplicate candidates occur
- logs show unstable oscillation between states
- config is invalid
- persistence layer cannot record events

## Pause triggers
WENN should enter `PAUSE` when any are true:
- feed is stale
- snapshot builder fails
- runtime state becomes inconsistent
- operator disables research loop

## Cooldown triggers
WENN should enter `COOLDOWN` after:
- a tracked candidate is invalidated
- a tracked candidate completes
- repeated low-quality conditions cause chatter

## v1 rule
WENN becomes stronger by rejecting more weak situations, not by forcing more actions.
