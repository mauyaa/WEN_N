import { useEffect, useState } from 'react';

export interface WennLiveControlStatus {
  mode: 'paper' | 'live_blocked';
  canActivateLive: boolean;
  guardReport: {
    liveEligible: boolean;
    summary: string;
    checks: Array<{
      key: string;
      passed: boolean;
      detail: string;
    }>;
  };
}

export function useWennLiveControl(pollMs = 10000) {
  const [status, setStatus] = useState<WennLiveControlStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const response = await fetch('/api/live-control/status');
        if (!response.ok) {
          throw new Error(`WENN live control request failed: ${response.status}`);
        }

        const next = (await response.json()) as WennLiveControlStatus;
        if (!cancelled) {
          setStatus(next);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'WENN live control unavailable');
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

  return { status, loading, error };
}
