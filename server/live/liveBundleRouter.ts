import express from 'express';
import { buildLiveBundle } from './liveBundle';

const router = express.Router();

router.get('/', async (_req, res) => {
  const bundle = await buildLiveBundle();
  res.json(bundle);
});

export default router;
