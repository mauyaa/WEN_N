import express from 'express';
import { getRuntimeCycle, getRuntimeStatusOnly } from './runtimeService';
import { getRuntimeMemory, getRuntimeMemorySummary, recordRuntimeCycle } from './runtimeMemory';
import { buildResearchInsightsReport } from './researchInsights';
import { buildPredictionReport } from './predictionEngine';
import { getLiveReadinessReport } from './liveReadiness';

const router = express.Router();

router.get('/status', (_req, res) => {
  const status = getRuntimeStatusOnly();
  res.json({ status });
});

router.get('/cycle', (_req, res) => {
  const cycle = getRuntimeCycle();
  recordRuntimeCycle(cycle);
  res.json(cycle);
});

router.get('/history', (_req, res) => {
  res.json({ history: getRuntimeMemory() });
});

router.get('/summary', (_req, res) => {
  res.json({ summary: getRuntimeMemorySummary() });
});

router.get('/insights', (_req, res) => {
  res.json(buildResearchInsightsReport());
});

router.get('/prediction', (_req, res) => {
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

  res.json({ insights, prediction });
});

router.get('/readiness', (_req, res) => {
  res.json(getLiveReadinessReport());
});

export default router;
