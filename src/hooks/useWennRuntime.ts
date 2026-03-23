import { useEffect, useState } from 'react';
import { getWennCycle, WennRuntimeCycle } from '../lib/wennRuntimeApi';

export function useWennRuntime(pollMs = 4000) {
  const [cycle, setCycle] = useState<WennRuntimeCycle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const next = await getWennCycle();
        if (!cancelled) {
          setCycle(next);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'WENN runtime unavailable');
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

  return { cycle, loading, error };
}
