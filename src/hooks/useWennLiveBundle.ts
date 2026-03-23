import { useEffect, useState } from 'react';

export interface WennLiveBundle {
  snapshot: any;
  controls: any;
  reconciliation: {
    orderMismatches: string[];
    positionMismatches: string[];
    fillMismatches: string[];
    healthy: boolean;
  };
}

export function useWennLiveBundle(pollMs = 10000) {
  const [bundle, setBundle] = useState<WennLiveBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const response = await fetch('/api/live/bundle');
        if (!response.ok) {
          throw new Error(`WENN live bundle request failed: ${response.status}`);
        }

        const next = (await response.json()) as WennLiveBundle;
        if (!cancelled) {
          setBundle(next);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'WENN live bundle unavailable');
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

  return { bundle, loading, error };
}
