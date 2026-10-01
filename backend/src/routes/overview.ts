import { Router, Request, Response, NextFunction } from 'express';
import { overviewService } from '../services/overviewService';

export const overviewRouter = Router();

/**
 * GET /api/overview
 * Query params: timeRange (10m, 1h, 6h, 24h, 7d, 30d), platform (all, x, telegram, reddit, youtube), daysBack
 */
overviewRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { timeRange, timeFilter, daysBack, platform } = req.query;

    const data = await overviewService.getOverview({
      timeRange: (timeRange as string) || (timeFilter as string),
      timeFilter: timeFilter as string,
      daysBack: daysBack as string,
      platform: platform as string,
    });

    res.json(data);
  } catch (error) {
    next(error);
  }
});
