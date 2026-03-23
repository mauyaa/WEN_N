import express from 'express';
import { getLiveSnapshotReport } from './liveService';

const router = express.Router();

router.get('/snapshot', async (_req, res) => {
  const report = await getLiveSnapshotReport();
  res.json(report);
});

export default router;
