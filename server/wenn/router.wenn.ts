import express from 'express';
import { getRuntimeCycle, getRuntimeStatusOnly } from './runtimeService';
import { getRuntimeMemory, getRuntimeMemorySummary, recordRuntimeCycle } from './runtimeMemory';

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

export default router;
