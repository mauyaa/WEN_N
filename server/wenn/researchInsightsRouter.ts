import express from 'express';
import { buildResearchInsightsReport } from './researchInsights';

const router = express.Router();

router.get('/', (_req, res) => {
  res.json(buildResearchInsightsReport());
});

export default router;
