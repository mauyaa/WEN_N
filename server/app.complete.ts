import express from 'express';
import cors from 'cors';
import tradingApiRouter from './tradingAPI';
import wennRouter from './wenn/router';
import wennCommandRouter from './wenn/commandRouter';
import liveRouter from './live/liveRouter';

export function createWennCompleteServerApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'WENN', mode: 'research-paper', shell: 'complete' });
  });

  app.use('/api/trading', tradingApiRouter);
  app.use('/api/wenn', wennRouter);
  app.use('/api/wenn-command', wennCommandRouter);
  app.use('/api/live', liveRouter);

  return app;
}
