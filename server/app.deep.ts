import express from 'express';
import cors from 'cors';
import tradingApiRouter from './tradingAPI';
import wennUnifiedRouter from './wenn/router.wenn';

export function createWennDeepServerApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'WENN', mode: 'research-paper', shell: 'deep' });
  });

  app.use('/api/trading', tradingApiRouter);
  app.use('/api/wenn', wennUnifiedRouter);

  return app;
}
