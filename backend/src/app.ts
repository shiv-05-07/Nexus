import express from 'express';
import cors from 'cors';
import { healthRouter } from './routes/health';
import { overviewRouter } from './routes/overview';
import { timelineRouter } from './routes/timeline';
import { sentimentRouter } from './routes/sentiment';
import { trendsRouter } from './routes/trends';
import { networkRouter } from './routes/network';
import { profileRouter, handleConfirmSignal, handleVerifyRecord } from './routes/profile';
import { notFound } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';

export function createApp() {
  const app = express();

  // Basic CORS configuration
  const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ];

  if (process.env.APP_URL) {
    allowedOrigins.push(process.env.APP_URL);
  }
  if (process.env.CORS_ORIGIN) {
    allowedOrigins.push(process.env.CORS_ORIGIN);
  }

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);
        if (
          allowedOrigins.includes(origin) ||
          origin.includes('.run.app') ||
          origin.includes('.supabase.co') ||
          process.env.NODE_ENV !== 'production'
        ) {
          return callback(null, true);
        }
        return callback(null, true); // Permissive in preview/dev environment
      },
      credentials: true,
    })
  );

  app.use(express.json());

  // API Routes
  app.use('/api/health', healthRouter);
  app.use('/api/overview', overviewRouter);
  app.use('/api/timeline', timelineRouter);
  app.use('/api/sentiment', sentimentRouter);
  app.use('/api/trends', trendsRouter);
  app.use('/api/network', networkRouter);
  app.use('/api/profile', profileRouter);

  // Dedicated Action endpoints with server-side authorization enforcement
  app.post('/api/signals/confirm', handleConfirmSignal);
  app.post('/api/records/verify', handleVerifyRecord);
  app.post('/api/overview/confirm-signal', handleConfirmSignal);
  app.post('/api/timeline/verify-record', handleVerifyRecord);

  // 404 handler
  app.use(notFound);

  // Centralized Error handler
  app.use(errorHandler);

  return app;
}

export const app = createApp();
