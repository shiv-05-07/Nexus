import { Router, Request, Response, NextFunction } from 'express';
import { networkService } from '../services/networkService';

export const networkRouter = Router();

/**
 * GET /api/network
 * Query params: timeRange, timeFilter, daysBack, platform, platformFilter
 */
networkRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { timeRange, timeFilter, daysBack, platform, platformFilter } = req.query;

    const dataset = await networkService.getNetwork({
      timeRange: (timeRange as string) || (timeFilter as string),
      timeFilter: timeFilter as string,
      daysBack: daysBack as string,
      platform: (platform as string) || (platformFilter as string),
      platformFilter: platformFilter as string,
    });

    res.json(dataset);
  } catch (error) {
    next(error);
  }
});
