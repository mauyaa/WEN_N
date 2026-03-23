# WENN Switchover Plan

## Goal
Promote the WENN-first experience from optional surface to primary product shell.

## New primary candidates
- `src/App.wenn.tsx`
- `src/main.wenn.tsx`
- `src/components/WennDeepControlRoom.tsx`

## Current legacy surfaces still active elsewhere
- `src/App.tsx`
- `src/components/TradingBot.tsx`
- parts of `src/components/Dashboard.tsx`

## Safe migration order
1. verify backend runtime endpoints are reachable
2. switch frontend entrypoint from current shell to `main.wenn.tsx`
3. keep `Dashboard` only where it supports the WENN shell
4. stop treating `TradingBot.tsx` as the primary intelligence surface
5. prune legacy demo panels only after replacement stability is confirmed

## What should become primary
The primary signed-in experience should emphasize:
- runtime state
- market health
- operator brief
- replay strip
- reason ledger
- memory summary

## What should become secondary or removable
- theatrical simulated market activity
- generic multi-coin client-side loops
- non-core promotional panels that dilute WENN identity

## Standard for deletion
Delete only when:
- replacement exists
- replacement is visible in the product
- replacement covers the same user purpose more clearly
