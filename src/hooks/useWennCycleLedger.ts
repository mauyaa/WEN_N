import { useMemo } from 'react';
import { useWennRuntime } from './useWennRuntime';
import { WennRuntimeCycle } from '../lib/wennRuntimeApi';

export interface WennLedgerEntry {
  id: string;
  cycle: WennRuntimeCycle;
  recordedAt: string;
}

function buildId(cycle: WennRuntimeCycle): string {
  return `${cycle.status.updatedAt}-${cycle.signal.action}-${cycle.snapshot.lastPrice}`;
}

export function useWennCycleLedger(limit = 18) {
  const runtime = useWennRuntime();

  const ledger = useMemo<WennLedgerEntry[]>(() => {
    if (!runtime.cycle) return [];

    return [
      {
        id: buildId(runtime.cycle),
        cycle: runtime.cycle,
        recordedAt: new Date().toISOString(),
      },
    ].slice(0, limit);
  }, [limit, runtime.cycle]);

  const summary = useMemo(() => {
    const latest = ledger[0]?.cycle;

    return {
      entries: ledger.length,
      state: latest?.status.state || 'BOOT',
      action: latest?.signal.action || 'wait',
      blocked: Boolean(latest?.guardrailReasons.length),
      confidence: latest ? Math.round(latest.signal.confidence * 100) : 0,
    };
  }, [ledger]);

  return {
    ...runtime,
    ledger,
    summary,
  };
}
