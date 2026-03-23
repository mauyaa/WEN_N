# WENN Unified Rollout

## Goal
Make the unified command-center shell the clearest promoted path for the product.

## Unified stack
### Frontend
- `src/App.unified.tsx`
- `src/main.unified.tsx`
- `src/components/WennUnifiedCommandCenter.tsx`

### Backend
- `server/app.unified.ts`
- `server/main.unified.ts`
- `server/wenn/commandRouter.ts`

## What the unified shell should represent
- one console
- one payload
- one operating language
- one command-center hierarchy

## Expected operator experience
The signed-in user should see:
- dashboard context
- runtime state
- memory and replay
- prediction bias
- market regime
- operational readiness

## Migration standard
The unified shell becomes primary when it is:
- more informative than the legacy flow
- more coherent than the legacy flow
- more trustworthy than the legacy flow

## Deletion rule
Legacy shells should only be removed after:
- the unified shell is visible and stable
- the same user purpose is covered more clearly
- duplicate pathways no longer provide unique value
