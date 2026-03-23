import express from 'express';
import cors from 'cors';
import tradingApiRouter from './tradingAPI';
import wennCommandRouter from './wenn/commandRouter';

export function createWennUnifiedServerApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'WENN', mode: 'research-paper', shell: 'unified-command' });
  });

  app.use('/api/trading', tradingApiRouter);
  app.use('/api/wenn-command', wennCommandRouter);

  return app;
}
