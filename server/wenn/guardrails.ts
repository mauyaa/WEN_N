import { FeatureSnapshot } from './types';

export interface ManipulationGuardrailResult {
  blocked: boolean;
  reasons: string[];
}

export function evaluateManipulationRisk(snapshot: FeatureSnapshot): ManipulationGuardrailResult {
  const reasons: string[] = [];

  if (!snapshot.websocketHealthy) {
    reasons.push('websocket_unhealthy');
  }

  if (snapshot.feedFreshnessMs > 3000) {
    reasons.push('feed_stale');
  }

  if (snapshot.atr > snapshot.lastPrice * 0.03) {
    reasons.push('atr_volatility_spike');
  }

  if (snapshot.volumeRatio > 2.5 && Math.abs(snapshot.recentReturn) < 0.0025) {
    reasons.push('volume_without_clean_displacement');
  }

  return {
    blocked: reasons.length > 0,
    reasons,
  };
}
