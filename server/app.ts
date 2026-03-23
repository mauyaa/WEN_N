import express from 'express';
import cors from 'cors';
import tradingApiRouter from './tradingAPI';
import wennRouter from './wenn/router';

export function createServerApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'WENN', mode: 'research-paper' });
  });

  app.use('/api/trading', tradingApiRouter);
  app.use('/api/wenn', wennRouter);

  return app;
}
