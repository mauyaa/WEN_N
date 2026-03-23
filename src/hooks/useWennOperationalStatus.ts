import { useEffect, useState } from 'react';

export interface WENNOperationalCheck {
  key: string;
  label: string;
  status: 'ready' | 'partial' | 'blocked';
  detail: string;
}

export interface WENNOperationalReport {
  mode: string;
  summary: string;
  checks: WENNOperationalCheck[];
}

export function useWennOperationalStatus(pollMs = 10000) {
  const [report, setReport] = useState<WENNOperationalReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const response = await fetch('/api/wenn-readiness');
        if (!response.ok) {
          throw new Error(`WENN operational status request failed: ${response.status}`);
        }

        const next = (await response.json()) as WENNOperationalReport;
        if (!cancelled) {
          setReport(next);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'WENN operational status unavailable');
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

  return { report, loading, error };
}
