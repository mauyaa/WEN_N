# WENN v1 Blueprint

## Core idea
**WENN = Knowing when.**

WENN is not a prediction toy and not a promise engine. It is a private, always-on, risk-first trading system that knows when to act and when to do nothing.

The first production direction is:
- private use only
- BTC only
- paper trading first
- deterministic execution
- strict risk limits
- full observability
- human override at all times

## Product philosophy
WENN should optimize for:
1. survival before profit
2. clarity before complexity
3. patience before frequency
4. deterministic behavior before AI freedom
5. clean logs before clever claims

## v1 scope
### Included
- live BTC market stream
- market state classification
- single strategy family
- paper trading
- trade journal
- position state tracking
- hard risk limits
- bot pause / stop modes
- dashboard for control and audit

### Not included
- guaranteed profit
- multi-user onboarding
- multi-exchange routing in v1
- BTC + ETH + SOL all at once
- autonomous LLM execution of orders
- martingale / averaging down / revenge logic

## Always-on runtime model
WENN should run as background workers even when the UI is closed.

### State machine
- `SCAN` -> ingest live market data and update features
- `WAIT` -> no valid setup
- `ARMED` -> setup is forming but not yet confirmed
- `ENTER` -> place trade with predefined stop and target
- `MANAGE` -> trail, protect, or reduce
- `EXIT` -> close and record outcome
- `PAUSE` -> system or risk concern, no new trades
- `STOP` -> manual or automatic hard shutdown

A bot without a strong `WAIT` state becomes a noise machine.

## Architecture
### 1. Frontend
Purpose:
- show bot status
- show live market state
- show open position and PnL
- show event log and trade journal
- allow manual pause / stop / resume

The frontend must never hold execution secrets.

### 2. API service
Purpose:
- auth and settings
- serve dashboard data
- save bot configuration
- expose logs, positions, fills, and metrics

### 3. Market data worker
Purpose:
- subscribe to BTC live feed
- build candles for required timeframes
- compute basic derived features
- detect stale or unhealthy data

### 4. Strategy engine
Purpose:
- classify market regime
- score setup quality
- emit strict structured signal objects

### 5. Risk engine
Purpose:
- cap position size
- block trades in dangerous conditions
- enforce drawdown rules
- pause system after repeated poor performance

### 6. Execution engine
Purpose:
- place and manage orders
- enforce stop-loss and take-profit instructions
- handle retries, rejections, and exchange errors
- reconcile exchange state with internal state

### 7. Storage
Persist:
- candles/features snapshots
- signals
- orders
- fills
- positions
- daily performance summaries
- system events and alerts

## Signal contract
All strategy outputs should be strict JSON, never loose prose.

Example:

```json
{
  "symbol": "BTCUSDT",
  "market_state": "trend_up",
  "action": "enter_long",
  "confidence": 0.74,
  "entry": 64250.0,
  "stop_loss": 63880.0,
  "take_profit": 64990.0,
  "reason": "pullback_in_uptrend",
  "invalidated": false
}
```

## Risk model
The goal is not zero losses. The goal is **no catastrophic losses**.

### Hard rules for v1
- risk per trade is fixed and small
- one open position at a time
- max daily loss limit
- max weekly drawdown limit
- no averaging down
- no trade when feed health is bad
- no trade after consecutive loss threshold until cooldown expires
- emergency kill switch

### Required veto checks
A signal must be rejected when any of these are true:
- market feed stale
- spread/slippage too high
- volatility outside allowed band
- confidence below threshold
- daily loss cap reached
- position size invalid
- exchange unavailable

## BTC-first plan
WENN should start with **BTC only** because:
- highest liquidity
- cleaner market structure than many alts
- easier debugging
- easier regime classification
- simpler evaluation

Only after stable BTC paper trading should WENN consider ETH, then SOL.

## AI role in WENN
LLMs can be useful, but not as the final order authority in v1.

### Good use of AI
- summarizing market context
- turning logs into human-readable notes
- classifying macro narrative or news themes
- helping explain why a trade was skipped

### Bad use of AI in v1
- directly sending live orders without deterministic gates
- replacing stop-loss logic
- replacing risk engine logic
- making free-form decisions with no schema

## Julia role
Julia can still be valuable.

Recommended role:
- feature scoring
- regime detection
- backtesting
- fast calculations
- deterministic signal generation

Avoid free-form expert-system prose as the main runtime contract.
Use typed inputs and strict outputs.

## Suggested data model
### Entities
- `bot_config`
- `market_snapshot`
- `signal`
- `risk_decision`
- `order`
- `fill`
- `position`
- `trade`
- `event_log`
- `daily_summary`

## Metrics that matter
Measure these from day one:
- number of trades
- win rate
- average win / average loss
- profit factor
- max drawdown
- consecutive losses
- time in market
- percentage of skipped setups
- API/data downtime

## v1 milestone sequence
### Milestone 1
- ingest live BTC data
- build state machine
- generate deterministic paper signals
- save full logs

### Milestone 2
- paper execution simulator
- journal and dashboard
- pause/stop controls
- alerts

### Milestone 3
- exchange sandbox integration
- order lifecycle reconciliation
- hard risk checks before every order

### Milestone 4
- tiny live trading only after stable paper performance

## Design direction
WENN should feel like:
- disciplined
- premium
- precise
- calm
- alert

Not casino, not hype, not noisy AI chaos.

Suggested tone:
- quiet confidence
- minimal motion
- sharp hierarchy
- dark premium palette
- very clear state labels

## One-sentence mission
**WENN is a private, always-on, risk-first trading system that knows when to act and, more importantly, when not to.**
