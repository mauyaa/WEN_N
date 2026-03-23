import express from 'express';
import { buildResearchInsightsReport } from './researchInsights';
import { buildPredictionReport } from './predictionEngine';

const router = express.Router();

router.get('/', (_req, res) => {
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

  res.json({
    insights,
    prediction,
  });
});

export default router;
