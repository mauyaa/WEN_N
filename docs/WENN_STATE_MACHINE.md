# WENN Runtime State Machine

## Core principle
WENN should become more selective as it becomes more capable.
The state machine is what gives the system patience, discipline, and observability.

## Primary runtime states
- `BOOT`
- `SCAN`
- `WAIT`
- `ARMED`
- `MANAGE`
- `COOLDOWN`
- `PAUSE`
- `STOP`

## State meanings
### `BOOT`
System initializes config, validates environment, and checks feed health.

### `SCAN`
System reads the latest BTC snapshot, computes features, and refreshes its internal view.

### `WAIT`
No valid candidate is present. WENN stays flat and watches for cleaner structure.

### `ARMED`
Conditions are improving and a candidate may form soon, but confirmation is still missing.

### `MANAGE`
A simulated position or tracked opportunity is active and must be supervised.

### `COOLDOWN`
A temporary quiet period after a rejected or finished opportunity to reduce noise.

### `PAUSE`
No new actions allowed because health, configuration, or risk checks failed.

### `STOP`
Hard shutdown state entered manually or automatically after a severe system concern.

## Transition rules
- `BOOT -> SCAN` when startup checks pass
- `BOOT -> PAUSE` when required services are unavailable
- `SCAN -> WAIT` when no clean candidate exists
- `SCAN -> ARMED` when structure is promising but incomplete
- `SCAN -> PAUSE` when data health is invalid
- `WAIT -> SCAN` on next evaluation cycle
- `ARMED -> MANAGE` when a paper candidate is accepted for tracking
- `ARMED -> WAIT` when structure deteriorates
- `MANAGE -> COOLDOWN` when tracked opportunity completes or is invalidated
- `COOLDOWN -> SCAN` when cooldown expires
- `ANY -> PAUSE` when guardrails are triggered
- `ANY -> STOP` on manual stop or unrecoverable failure
- `PAUSE -> SCAN` only after health checks recover and operator conditions allow resume

## Design intent
This model is intentionally conservative.
WENN should spend most of its time in `WAIT`, not in noisy action states.

## UI mapping
- `BOOT` = initializing
- `SCAN` = reading market
- `WAIT` = standing by
- `ARMED` = candidate forming
- `MANAGE` = active supervision
- `COOLDOWN` = quiet period
- `PAUSE` = blocked by guardrails
- `STOP` = halted

## Rule of quality
If WENN is jumping between action states too frequently, the system is not selective enough.
