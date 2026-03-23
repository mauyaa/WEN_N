import { getRuntimeCycle } from './runtimeService';
import { recordRuntimeCycle, getRuntimeMemorySummary } from './runtimeMemory';
import { buildResearchInsightsReport } from './researchInsights';
import { buildPredictionReport } from './predictionEngine';
import { getLiveReadinessReport } from './liveReadiness';
import { buildRegimeReport } from './regimeEngine';

export interface CommandBundle {
  cycle: ReturnType<typeof getRuntimeCycle>;
  memorySummary: ReturnType<typeof getRuntimeMemorySummary>;
  insights: ReturnType<typeof buildResearchInsightsReport>;
  prediction: ReturnType<typeof buildPredictionReport>;
  regime: ReturnType<typeof buildRegimeReport>;
  readiness: ReturnType<typeof getLiveReadinessReport>;
}

export function buildCommandBundle(): CommandBundle {
  const cycle = getRuntimeCycle();
  recordRuntimeCycle(cycle);

  const insights = buildResearchInsightsReport();

  const regime = buildRegimeReport({
    symbol: insights.observation.symbol,
    timeframe: insights.observation.timeframe,
    structureLabel: insights.observation.structureLabel,
    momentumLabel: insights.observation.momentumLabel,
    volatilityLabel: insights.observation.volatilityLabel,
    patternType: insights.patternContext.pattern?.type,
    marketState: insights.patternContext.marketState,
    guardrailBlocked: insights.patternContext.guardrailBlocked,
  });

  const prediction = buildPredictionReport({
    symbol: insights.observation.symbol,
    timeframe: insights.observation.timeframe,
    structureLabel: insights.observation.structureLabel,
    momentumLabel: insights.observation.momentumLabel,
    volatilityLabel: insights.observation.volatilityLabel,
    patternType: insights.patternContext.pattern?.type,
    marketState: insights.patternContext.marketState,
    guardrailBlocked: insights.patternContext.guardrailBlocked,
  });

  return {
    cycle,
    memorySummary: getRuntimeMemorySummary(),
    insights,
    prediction,
    regime,
    readiness: getLiveReadinessReport(),
  };
}
