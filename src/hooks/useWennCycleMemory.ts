import { useEffect, useMemo, useState } from 'react';
import { getWennCycle, WennRuntimeCycle } from '../lib/wennRuntimeApi';

export interface WennCycleMemoryEntry {
  id: string;
  cycle: WennRuntimeCycle;
}

function buildCycleId(cycle: WennRuntimeCycle): string {
  return `${cycle.status.updatedAt}-${cycle.signal.action}-${cycle.snapshot.lastPrice}`;
}

export function useWennCycleMemory(limit = 24, pollMs = 4000) {
  const [history, setHistory] = useState<WennCycleMemoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const cycle = await getWennCycle();
        if (cancelled) return;

        setHistory((prev) => {
          const id = buildCycleId(cycle);
          if (prev[0]?.id === id) return prev;
          return [{ id, cycle }, ...prev].slice(0, limit);
        });

        setError(null);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'WENN cycle memory unavailable');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    run();
    const timer = window.setInterval(run, pollMs);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [limit, pollMs]);

  const latest = history[0]?.cycle ?? null;

  const summary = useMemo(() => {
    return {
      entries: history.length,
      armedCount: history.filter((item) => item.cycle.status.state === 'ARMED').length,
      pauseCount: history.filter((item) => item.cycle.status.state === 'PAUSE').length,
      blockedCount: history.filter((item) => item.cycle.guardrailReasons.length > 0).length,
      waitCount: history.filter((item) => item.cycle.signal.action === 'wait').length,
    };
  }, [history]);

  return {
    latest,
    history,
    summary,
    loading,
    error,
  };
}
