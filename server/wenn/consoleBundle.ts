import { getRuntimeCycle } from './runtimeService';
import { recordRuntimeCycle, getRuntimeMemorySummary } from './runtimeMemory';
import { buildResearchInsightsReport } from './researchInsights';
import { buildPredictionReport } from './predictionEngine';
import { getLiveReadinessReport } from './liveReadiness';

export interface ConsoleBundle {
  cycle: ReturnType<typeof getRuntimeCycle>;
  memorySummary: ReturnType<typeof getRuntimeMemorySummary>;
  insights: ReturnType<typeof buildResearchInsightsReport>;
  prediction: ReturnType<typeof buildPredictionReport>;
  readiness: ReturnType<typeof getLiveReadinessReport>;
}

export function buildConsoleBundle(): ConsoleBundle {
  const cycle = getRuntimeCycle();
  recordRuntimeCycle(cycle);

  const insights = buildResearchInsightsReport();
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
    readiness: getLiveReadinessReport(),
  };
}
