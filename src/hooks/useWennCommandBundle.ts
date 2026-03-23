import { useEffect, useState } from 'react';

export interface WennCommandBundle {
  cycle: any;
  memorySummary: {
    entries: number;
    waitCount: number;
    armedCount: number;
    pauseCount: number;
    blockedCount: number;
  };
  insights: any;
  prediction: {
    symbol: string;
    timeframe: string;
    bias: 'bullish' | 'bearish' | 'neutral';
    confidence: number;
    horizon: string;
    reasons: string[];
    invalidation: string;
    riskNote: string;
  };
  regime: {
    symbol: string;
    timeframe: string;
    regime: 'accumulation' | 'markup' | 'distribution' | 'markdown' | 'transition' | 'unclear';
    confidence: number;
    reasons: string[];
    caution: string;
  };
  readiness: {
    mode: string;
    summary: string;
    checks: Array<{
      key: string;
      label: string;
      status: 'ready' | 'partial' | 'blocked';
      detail: string;
    }>;
  };
}

export function useWennCommandBundle(pollMs = 7000) {
  const [bundle, setBundle] = useState<WennCommandBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const response = await fetch('/api/wenn-command');
        if (!response.ok) {
          throw new Error(`WENN command bundle request failed: ${response.status}`);
        }

        const next = (await response.json()) as WennCommandBundle;
        if (!cancelled) {
          setBundle(next);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'WENN command bundle unavailable');
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
