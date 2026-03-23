import express from 'express';
import { buildConsoleBundle } from './consoleBundle';

const router = express.Router();

router.get('/', (_req, res) => {
  res.json(buildConsoleBundle());
});

export default router;
