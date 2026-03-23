import express from 'express';
import { getRuntimeMemory, getRuntimeMemorySummary } from './runtimeMemory';

const router = express.Router();

router.get('/history', (_req, res) => {
  res.json({ history: getRuntimeMemory() });
});

router.get('/summary', (_req, res) => {
  res.json({ summary: getRuntimeMemorySummary() });
});

export default router;
