# WENN Integration Notes

## What has been added
### Backend
- `server/wenn/types.ts`
- `server/wenn/stateMachine.ts`
- `server/wenn/runtime.ts`
- `server/wenn/guardrails.ts`
- `server/wenn/mockSnapshot.ts`
- `server/wenn/runtimeService.ts`
- `server/wenn/router.ts`
- `server/app.ts`
- `server/main.ts`

### Frontend
- `src/lib/wennRuntimeApi.ts`
- `src/hooks/useWennRuntime.ts`
- `src/components/WennRuntimePanel.tsx`
- `src/components/WennResearchSurface.tsx`

## Immediate UI wiring recommendation
Render `WennResearchSurface` in the dashboard or near the trading control area.

## Backend routing recommendation
Run the server from `server/main.ts` and expose:
- `/api/health`
- `/api/trading/*`
- `/api/wenn/status`
- `/api/wenn/cycle`

## Suggested cleanup approach
Do not delete current UI or demo files yet.
Instead, gradually replace simulation-driven surfaces with WENN runtime surfaces once the new flow is verified.

## Priority next step
Mount the new backend and let the frontend read live runtime cycles from `/api/wenn/cycle`.
