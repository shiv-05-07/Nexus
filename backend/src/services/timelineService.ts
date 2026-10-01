import {
  Platform as PrismaPlatform,
  SentimentType as PrismaSentiment,
  Prisma,
} from '@prisma/client';
import { prisma } from '../db/prisma';
import { parseTimeFilter, mapPlatformFilter } from './overviewService';

export interface TimelineQueryParams {
  platform?: string;
  sentiment?: string;
  topicId?: string;
  searchQuery?: string;
  search?: string;
  q?: string;
  timeRange?: string;
  timeFilter?: string;
  daysBack?: number | string;
  limit?: number | string;
  offset?: number | string;
  rawArray?: string | boolean;
}

export function mapSentimentFilter(sentiment?: string): PrismaSentiment | null {
  if (!sentiment || sentiment.toLowerCase() === 'all') return null;
  const s = sentiment.toUpperCase();
  if (s === 'POSITIVE') return PrismaSentiment.POSITIVE;
  if (s === 'NEUTRAL') return PrismaSentiment.NEUTRAL;
  if (s === 'NEGATIVE') return PrismaSentiment.NEGATIVE;
  return null;
}

export class TimelineService {
  async getTimeline(params: TimelineQueryParams) {
    const platformFilter = mapPlatformFilter(params.platform);
    const sentimentFilter = mapSentimentFilter(params.sentiment);
    const searchQuery = (params.searchQuery || params.search || params.q || '').trim();
    const topicIdFilter = (params.topicId || '').trim();

    // Pagination bounds
    const rawLimit = typeof params.limit === 'number' ? params.limit : parseInt(params.limit || '50', 10);
    const rawOffset = typeof params.offset === 'number' ? params.offset : parseInt(params.offset || '0', 10);
    const limit = isNaN(rawLimit) ? 50 : Math.min(200, Math.max(1, rawLimit));
    const offset = isNaN(rawOffset) ? 0 : Math.max(0, rawOffset);

    // Optional time filtering
    let sinceDate: Date | null = null;
    if (params.timeRange || params.timeFilter || params.daysBack) {
      const { daysBack } = parseTimeFilter(params.timeRange, params.timeFilter, params.daysBack);
      const latestPost = await prisma.post.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      });
      const refDate = latestPost ? latestPost.createdAt : new Date();
      sinceDate = new Date(refDate.getTime() - daysBack * 86400 * 1000);
    }

    // Build Prisma Where clause
    const where: Prisma.PostWhereInput = {};

    if (platformFilter) {
      where.platform = platformFilter;
    }

    if (sentimentFilter) {
      where.sentiment = sentimentFilter;
    }

    if (sinceDate) {
      where.createdAt = { gte: sinceDate };
    }

    if (topicIdFilter && topicIdFilter !== 'all') {
      where.OR = [
        { topicId: topicIdFilter },
        { topic: { slug: topicIdFilter } },
        { topic: { name: { contains: topicIdFilter, mode: 'insensitive' } } },
      ];
    }

    if (searchQuery) {
      const searchConditions: Prisma.PostWhereInput[] = [
        { content: { contains: searchQuery, mode: 'insensitive' } },
        { author: { handle: { contains: searchQuery, mode: 'insensitive' } } },
        { author: { displayName: { contains: searchQuery, mode: 'insensitive' } } },
        { topic: { name: { contains: searchQuery, mode: 'insensitive' } } },
      ];

      if (where.OR) {
        where.AND = [{ OR: where.OR }, { OR: searchConditions }];
        delete where.OR;
      } else {
        where.OR = searchConditions;
      }
    }

    // Execute query with total count
    const [total, posts] = await Promise.all([
      prisma.post.count({ where }),
      prisma.post.findMany({
        where,
        include: {
          author: {
            include: { community: true },
          },
          topic: true,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
    ]);

    // Map database posts into NEXUS TimelineEvent contract
    const items = posts.map((post) => {
      const timeDate = post.createdAt;
      const timeFormatted = timeDate.toISOString().substring(11, 19);

      return {
        id: post.id || post.platformPostId,
        timestamp: post.createdAt.toISOString(),
        timeFormatted,
        platform: post.platform.toLowerCase() as 'x' | 'telegram' | 'reddit' | 'youtube',
        topicId: post.topic?.slug || post.topic?.id || '',
        topicName: post.topic?.name || 'General Dispatch',
        authorHandle: post.author.handle,
        authorAlias: post.author.alias || post.author.displayName,
        content: post.content,
        sentiment: post.sentiment.toLowerCase() as 'positive' | 'neutral' | 'negative',
        emotion: post.emotion.toLowerCase() as 'anxiety' | 'excitement' | 'supportive' | 'opposition' | 'sarcasm',
        engagement: {
          likes: post.likesCount,
          reposts: post.repostsCount,
          comments: post.commentsCount,
          views: post.viewsCount,
        },
        reachScore: post.reachScore,
        verified: post.author.verified,
      };
    });

    return {
      items,
      total,
      limit,
      offset,
    };
  }
}

export const timelineService = new TimelineService();
