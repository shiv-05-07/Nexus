import { Router, Request, Response, NextFunction } from 'express';
import { timelineService } from '../services/timelineService';

export const timelineRouter = Router();

/**
 * GET /api/timeline
 * Query params: platform, sentiment, topicId, searchQuery, search, q, limit, offset, format
 */
timelineRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      platform,
      sentiment,
      topicId,
      searchQuery,
      search,
      q,
      timeRange,
      timeFilter,
      daysBack,
      limit,
      offset,
      format,
    } = req.query;

    const result = await timelineService.getTimeline({
      platform: platform as string,
      sentiment: sentiment as string,
      topicId: topicId as string,
      searchQuery: (searchQuery as string) || (search as string) || (q as string),
      timeRange: (timeRange as string) || (timeFilter as string),
      timeFilter: timeFilter as string,
      daysBack: daysBack as string,
      limit: limit as string,
      offset: offset as string,
    });

    if (format === 'array') {
      res.json(result.items);
    } else {
      res.json(result);
    }
  } catch (error) {
    next(error);
  }
});
