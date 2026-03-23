import { useEffect, useState } from 'react';

export interface WennLiveSnapshot {
  account: {
    provider: string;
    accountId: string;
    label?: string;
    timestamp: number;
  };
  balances: Array<{
    asset: string;
    free: number;
    locked: number;
    total: number;
    timestamp: number;
  }>;
  openOrders: Array<any>;
  openPositions: Array<any>;
  recentFills: Array<any>;
  provider: string;
  mode: 'paper';
}

export function useWennLiveSnapshot(pollMs = 10000) {
  const [snapshot, setSnapshot] = useState<WennLiveSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const response = await fetch('/api/live/snapshot');
        if (!response.ok) {
          throw new Error(`WENN live snapshot request failed: ${response.status}`);
        }

        const next = (await response.json()) as WennLiveSnapshot;
        if (!cancelled) {
          setSnapshot(next);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'WENN live snapshot unavailable');
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
  }, [pollMs]);

  return { snapshot, loading, error };
}
