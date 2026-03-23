import express from 'express';
import cors from 'cors';
import tradingApiRouter from './tradingAPI';
import wennUnifiedRouter from './wenn/router.wenn';
import wennReadinessRouter from './wenn/liveReadinessRouter';

export function createWennCommandServerApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'WENN', mode: 'research-paper', shell: 'command-center' });
  });

  app.use('/api/trading', tradingApiRouter);
  app.use('/api/wenn', wennUnifiedRouter);
  app.use('/api/wenn-readiness', wennReadinessRouter);

  return app;
}
