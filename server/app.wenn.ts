import express from 'express';
import cors from 'cors';
import tradingApiRouter from './tradingAPI';
import wennRouter from './wenn/router';
import wennMemoryRouter from './wenn/runtimeMemoryRouter';

export function createWennServerApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'WENN', mode: 'research-paper', shell: 'wenn-first' });
  });

  app.use('/api/trading', tradingApiRouter);
  app.use('/api/wenn', wennRouter);
  app.use('/api/wenn-memory', wennMemoryRouter);

  return app;
}
