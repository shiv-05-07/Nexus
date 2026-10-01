import { Router, Request, Response } from 'express';
import { prisma } from '../db/prisma';

export const healthRouter = Router();

/**
 * GET /api/health
 */
healthRouter.get('/', async (_req: Request, res: Response) => {
  try {
    // Quick probe to verify DB connection
    const userCount = await prisma.user.count();
    res.json({
      status: 'ok',
      service: 'NEXUS Intelligence API',
      database: 'connected',
      metrics: {
        monitoredUsers: userCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'degraded',
      service: 'NEXUS Intelligence API',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Database check failed',
      timestamp: new Date().toISOString(),
    });
  }
});
