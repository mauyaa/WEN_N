# WENN Strategy Research Principles

## Goal
Use AI to improve observation, explanation, and research quality without turning WENN into a reckless black-box trader.

## Core principle
AI should first learn to describe the market clearly before it is trusted to influence strategy selection.

## 1. AI for raw market observation
WENN should support an AI observer that can look at raw BTC candles and describe what it sees in plain language.

### Good use
- describe trend pressure
- describe volatility expansion or compression
- describe whether candles look orderly or chaotic
- describe whether reversals appear clean or weak
- summarize structure without pretending certainty

### Why this matters
If the model can explain the market from raw candles, it may produce useful narrative context without depending entirely on prebuilt indicators.

## 2. AI for market context
WENN can use AI to summarize:
- sentiment shifts
- market mood
- capital rotation hints
- contextual risk

### Constraint
In early versions, AI context should not be the sole reason for an action.
It should support the operator brief and research reasoning layer.

## 3. Strategy generation and optimization
WENN may use AI to help generate research hypotheses, for example:
- trend pullback continuation rules
- zone rejection rules
- confirmation stack variations
- stop-loss and take-profit templates

### Constraint
Generated strategies must always pass:
- deterministic rule conversion
- backtesting
- replay review
- risk review

AI can propose ideas.
It should not skip validation.

## 4. Proper backtesting
Every strategy candidate must be tested before becoming important.

### Minimum requirements
- replay against historical candles
- performance by regime
- drawdown review
- false-signal review
- stability review after parameter changes

## 5. Risk management first
A strategy without risk discipline is not a strategy.

Required controls:
- stop loss logic
- position sizing logic
- max exposure rules
- cooldown after failure
- explicit invalidation levels
- live-mode kill switch

## 6. Adaptive strategy lifecycle
WENN must assume that no strategy stays effective forever.

### Required behavior
- monitor degradation
- compare recent performance to historical baseline
- downgrade weak strategies
- pause unstable strategies
- review assumptions after repeated failure

## 7. Human role
In the strongest early version of WENN:
- AI observes
- runtime evaluates
- risk layer constrains
- human remains the accountable final operator for live activation

## One-line principle
**WENN should use AI to see more clearly, not to abandon discipline.**
