import { MarketRegime, RegimeInputContext, RegimeReport } from './regimeContracts';

export function buildRegimeReport(context: RegimeInputContext): RegimeReport {
  const reasons: string[] = [];
  let regime: MarketRegime = 'unclear';
  let confidence = 0.45;

  if (context.guardrailBlocked) {
    reasons.push('guardrails_reduce_regime_trust');
    confidence = 0.2;
  }

  if (context.momentumLabel === 'bullish' && context.structureLabel === 'orderly') {
    regime = 'markup';
    confidence = Math.max(confidence, 0.68);
    reasons.push('orderly_bullish_structure');
  }

  if (context.momentumLabel === 'bearish' && context.structureLabel === 'orderly') {
    regime = 'markdown';
    confidence = Math.max(confidence, 0.68);
    reasons.push('orderly_bearish_structure');
  }

  if (context.volatilityLabel === 'compressed' && context.structureLabel !== 'chaotic') {
    if (context.momentumLabel === 'neutral') {
      regime = 'accumulation';
      confidence = Math.max(confidence, 0.58);
      reasons.push('compressed_neutral_structure');
    }
  }

  if (context.volatilityLabel === 'expanded' && context.structureLabel === 'mixed') {
    regime = 'distribution';
    confidence = Math.max(confidence, 0.55);
    reasons.push('expanded_mixed_structure');
  }

  if (context.structureLabel === 'chaotic') {
    regime = 'transition';
    confidence = Math.min(confidence, 0.42);
    reasons.push('chaotic_structure');
  }

  if (context.guardrailBlocked) {
    regime = 'unclear';
  }

  if (reasons.length === 0) {
    reasons.push('no_clean_regime_edge');
  }

  return {
    symbol: context.symbol,
    timeframe: context.timeframe,
    regime,
    confidence,
    reasons,
    caution: context.guardrailBlocked
      ? 'Guardrails are active. Regime confidence should not be trusted for escalation.'
      : 'Regime is contextual guidance and must remain subordinate to risk and execution quality.',
  };
}
