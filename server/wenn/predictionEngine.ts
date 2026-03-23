import { PredictionInputContext, PredictionReport } from './predictionContracts';

export function buildPredictionReport(context: PredictionInputContext): PredictionReport {
  const reasons: string[] = [];
  let bias: 'bullish' | 'bearish' | 'neutral' = 'neutral';
  let confidence = 0.5;

  if (context.guardrailBlocked) {
    reasons.push('guardrails_reduce_trust');
    confidence = 0.25;
  }

  if (context.momentumLabel === 'bullish' && context.structureLabel === 'orderly') {
    bias = 'bullish';
    confidence = Math.max(confidence, 0.68);
    reasons.push('orderly_bullish_structure');
  }

  if (context.momentumLabel === 'bearish' && context.structureLabel === 'orderly') {
    bias = 'bearish';
    confidence = Math.max(confidence, 0.68);
    reasons.push('orderly_bearish_structure');
  }

  if (context.patternType === 'bullish_engulfing') {
    bias = 'bullish';
    confidence = Math.max(confidence, 0.7);
    reasons.push('bullish_engulfing_context');
  }

  if (context.patternType === 'bearish_engulfing') {
    bias = 'bearish';
    confidence = Math.max(confidence, 0.7);
    reasons.push('bearish_engulfing_context');
  }

  if (context.structureLabel === 'chaotic' || context.volatilityLabel === 'expanded') {
    confidence = Math.min(confidence, 0.42);
    reasons.push('context_is_noisy');
  }

  if (context.guardrailBlocked) {
    bias = 'neutral';
  }

  if (reasons.length === 0) {
    reasons.push('no_clear_edge_detected');
  }

  return {
    symbol: context.symbol,
    timeframe: context.timeframe,
    bias,
    confidence,
    horizon: context.timeframe,
    reasons,
    invalidation: 'Bias becomes invalid if market structure deteriorates or guardrails activate.',
    riskNote: context.guardrailBlocked
      ? 'Guardrails are active. Prediction confidence is intentionally reduced.'
      : 'Prediction is probabilistic and should remain subordinate to risk controls.',
  };
}
