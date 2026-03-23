import express from 'express';
import { buildCommandBundle } from './commandBundle';

const router = express.Router();

router.get('/', (_req, res) => {
  res.json(buildCommandBundle());
});

export default router;
