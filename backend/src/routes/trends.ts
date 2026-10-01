import { Router, Request, Response, NextFunction } from 'express';
import { trendService } from '../services/trendService';

export const trendsRouter = Router();

/**
 * GET /api/trends
 * Query params: timeRange, timeFilter, daysBack, platform, format
 */
trendsRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { timeRange, timeFilter, daysBack, platform, format } = req.query;

    const items = await trendService.getTrends({
      timeRange: (timeRange as string) || (timeFilter as string),
      timeFilter: timeFilter as string,
      daysBack: daysBack as string,
      platform: platform as string,
    });

    if (format === 'object') {
      res.json({
        items,
        total: items.length,
      });
    } else {
      res.json(items);
    }
  } catch (error) {
    next(error);
  }
});
