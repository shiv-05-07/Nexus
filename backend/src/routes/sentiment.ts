import { Router, Request, Response, NextFunction } from 'express';
import { sentimentService } from '../services/sentimentService';

export const sentimentRouter = Router();

/**
 * GET /api/sentiment
 * Query params: timeRange, timeFilter, daysBack, platform, type
 * If type is specified (composition, trends, emotions, platforms), returns that sub-resource.
 * Otherwise returns the complete unified sentiment payload.
 */
sentimentRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { timeRange, timeFilter, daysBack, platform, type } = req.query;

    const params = {
      timeRange: (timeRange as string) || (timeFilter as string),
      timeFilter: timeFilter as string,
      daysBack: daysBack as string,
      platform: platform as string,
    };

    if (type === 'composition') {
      const composition = await sentimentService.getComposition(params);
      res.json(composition);
    } else if (type === 'trends') {
      const trends = await sentimentService.getTrends(params);
      res.json(trends);
    } else if (type === 'emotions') {
      const emotions = await sentimentService.getEmotions(params);
      res.json(emotions);
    } else if (type === 'platforms' || type === 'platformComparison') {
      const platformComparison = await sentimentService.getPlatformComparison(params);
      res.json(platformComparison);
    } else {
      const data = await sentimentService.getFullSentiment(params);
      res.json(data);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/sentiment/composition
 */
sentimentRouter.get('/composition', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { timeRange, timeFilter, daysBack, platform } = req.query;
    const data = await sentimentService.getComposition({
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

/**
 * GET /api/sentiment/trends
 */
sentimentRouter.get('/trends', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { timeRange, timeFilter, daysBack, platform } = req.query;
    const data = await sentimentService.getTrends({
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

/**
 * GET /api/sentiment/emotions
 */
sentimentRouter.get('/emotions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { timeRange, timeFilter, daysBack, platform } = req.query;
    const data = await sentimentService.getEmotions({
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

/**
 * GET /api/sentiment/platforms
 */
sentimentRouter.get('/platforms', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { timeRange, timeFilter, daysBack, platform } = req.query;
    const data = await sentimentService.getPlatformComparison({
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
