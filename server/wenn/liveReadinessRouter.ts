import express from 'express';
import { getLiveReadinessReport } from './liveReadiness';

const router = express.Router();

router.get('/', (_req, res) => {
  res.json(getLiveReadinessReport());
});

export default router;
