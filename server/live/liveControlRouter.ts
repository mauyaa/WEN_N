import express from 'express';
import { getLiveControlStatus } from './liveControlService';

const router = express.Router();

router.get('/status', (_req, res) => {
  res.json(getLiveControlStatus());
});

export default router;
