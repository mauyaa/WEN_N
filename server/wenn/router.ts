import express from 'express';
import { getRuntimeCycle, getRuntimeStatusOnly } from './runtimeService';

const router = express.Router();

router.get('/status', (_req, res) => {
  const status = getRuntimeStatusOnly();
  res.json({ status });
});

router.get('/cycle', (_req, res) => {
  const cycle = getRuntimeCycle();
  res.json(cycle);
});

export default router;
