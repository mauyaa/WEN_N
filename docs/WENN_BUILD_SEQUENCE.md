# WENN Build Sequence

## North star
WENN v1 should be a private, BTC-first, always-on system built for paper trading, observability, and disciplined decision-making.

## Principle
Build in this order:
1. data reliability
2. state classification
3. structured signal generation
4. risk guardrails
5. paper execution
6. audit trail and dashboard
7. controlled evaluation

## Milestone 1 — Runtime foundation
- Create a background worker for market data ingestion
- Normalize candle data across selected timeframes
- Add feed health monitoring
- Persist snapshots for replay and debugging

## Milestone 2 — Decision contracts
- Define strict JSON contracts for state, signal, and risk output
- Remove free-form runtime decisions
- Enforce deterministic outputs for every cycle

## Milestone 3 — Guardrails
- Add pause states
- Add cooldown states
- Add data-health checks
- Add simulation-only restrictions for v1

## Milestone 4 — Paper mode
- Simulate entries and exits
- Record every decision and outcome
- Build a journal of why WENN acted or waited

## Milestone 5 — Control surface
- Dashboard for status, logs, and outcomes
- Clear labels for WAIT, SCAN, PAUSE, and STOP
- Manual override controls

## Milestone 6 — Evaluation
- Measure signal quality
- Measure stability
- Reduce noise
- Keep the system selective and explainable

## Design direction
WENN should feel calm, sharp, and premium.
Avoid casino aesthetics and noisy interfaces.

## Immediate next tasks
- implement the runtime state machine
- define signal and risk interfaces
- wire a paper-trading event log
- expose state to the dashboard

## One-line rule
WENN should become smarter by becoming clearer, not louder.
