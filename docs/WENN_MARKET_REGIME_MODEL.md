# WENN Market Regime Model

## Goal
Give WENN a structured way to reason about broader crypto market phases without reducing the market to a single indicator.

## Core rule
A regime is inferred from multiple layers acting together:
- price structure
- volatility
- volume participation
- order-book pressure
- account/exchange flow context
- sentiment or macro context when available

## Primary regime labels
- `accumulation`
- `markup`
- `distribution`
- `markdown`
- `transition`
- `unclear`

## Regime descriptions
### Accumulation
WENN should consider accumulation when:
- downside pressure is slowing
- volatility is stabilizing after weakness
- price is building a base instead of impulsing lower
- participation improves near lower areas
- sentiment is weak but not collapsing further

### Markup
WENN should consider markup when:
- higher highs / higher lows are visible
- breakouts hold instead of failing immediately
- volume supports expansion
- pullbacks are controlled
- confidence improves without guardrail stress

### Distribution
WENN should consider distribution when:
- trend advance loses quality
- price stalls near highs in a wide or volatile range
- upside continuation weakens
- rejection behavior increases
- sentiment remains optimistic while structure becomes mixed

### Markdown
WENN should consider markdown when:
- lower highs / lower lows dominate
- support breaks fail to recover cleanly
- volatility expands to the downside
- rallies weaken into supply
- fear rises while participation supports downward pressure

### Transition
Use when WENN sees signs of regime change but not enough stability to commit to a clearer label.

### Unclear
Use when data, structure, or context is too weak or too contradictory.

## Inputs that should influence regime classification
### Core v1 inputs
- candle structure
- trend alignment
- ATR / volatility state
- volume ratio
- pattern context
- guardrail state

### Later inputs
- fear/greed context
- exchange net flow summaries
- top-of-book pressure
- broader macro event context

## WENN discipline
A regime label should influence confidence, not replace it.
A regime engine is a context layer, not a permission slip.

## Strong v1 behavior
Start simple:
- identify markup / markdown / unclear first
- add accumulation / distribution when supporting context improves
- prefer `transition` or `unclear` over forced certainty

## One-line principle
**WENN should classify regime from layered evidence, not from a single dramatic signal.**
