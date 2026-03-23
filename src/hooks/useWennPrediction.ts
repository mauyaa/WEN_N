import { useEffect, useState } from 'react';

export interface WENNPrediction {
  symbol: string;
  timeframe: string;
  bias: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  horizon: string;
  reasons: string[];
  invalidation: string;
  riskNote: string;
}

export interface WENNPredictionResponse {
  insights: unknown;
  prediction: WENNPrediction;
}

export function useWennPrediction(pollMs = 8000) {
  const [data, setData] = useState<WENNPredictionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const response = await fetch('/api/wenn/prediction');
        if (!response.ok) {
          throw new Error(`WENN prediction request failed: ${response.status}`);
        }
        const next = (await response.json()) as WENNPredictionResponse;
        if (!cancelled) {
          setData(next);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'WENN prediction unavailable');
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

  return { data, loading, error };
}
