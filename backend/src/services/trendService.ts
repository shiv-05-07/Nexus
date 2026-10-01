import {
  Platform as PrismaPlatform,
  SentimentType as PrismaSentiment,
  Prisma,
} from '@prisma/client';
import { prisma } from '../db/prisma';
import { parseTimeFilter, mapPlatformFilter } from './overviewService';

export interface TrendQueryParams {
  timeRange?: string;
  timeFilter?: string;
  daysBack?: number | string;
  platform?: string;
}

export interface TrendItemResult {
  id: string;
  name: string;
  volume: number;
  accelerationPct: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  dominantEmotion: 'anxiety' | 'excitement' | 'supportive' | 'opposition' | 'sarcasm';
  platforms: ('x' | 'telegram' | 'reddit' | 'youtube')[];
  communityName: string;
  sparkline: number[];
  isAccelerating: boolean;
  x: number;
  y: number;
  radius: number;
}

export class TrendService {
  async getTrends(params: TrendQueryParams): Promise<TrendItemResult[]> {
    const { daysBack } = parseTimeFilter(params.timeRange, params.timeFilter, params.daysBack);
    const platformFilter = mapPlatformFilter(params.platform);

    const latestPost = await prisma.post.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    });
    const refDate = latestPost ? latestPost.createdAt : new Date();
    const sinceDate = new Date(refDate.getTime() - daysBack * 86400 * 1000);

    const postWhere: Prisma.PostWhereInput = {
      createdAt: { gte: sinceDate },
    };

    if (platformFilter) {
      postWhere.platform = platformFilter;
    }

    // Fetch all topics and their matching posts in this timeframe
    const topics = await prisma.topic.findMany({
      include: {
        posts: {
          where: postWhere,
          include: {
            author: {
              include: { community: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    // Only topics with posts in the window
    const activeTopics = topics.filter((t) => t.posts.length > 0);

    if (activeTopics.length === 0) {
      return [];
    }

    const windowMs = refDate.getTime() - sinceDate.getTime();
    const bucketCount = 8;
    const bucketDurationMs = windowMs / bucketCount;

    // Process raw metrics for each topic
    const topicMetrics = activeTopics.map((topic) => {
      const topicPosts = topic.posts;
      const volume = topicPosts.length;

      // 1. Dominant Sentiment
      let pos = 0;
      let neu = 0;
      let neg = 0;
      const emotionsCount: Record<string, number> = {};
      const commCount: Record<string, number> = {};
      const platformsSet = new Set<string>();

      topicPosts.forEach((p) => {
        if (p.sentiment === PrismaSentiment.POSITIVE) pos++;
        else if (p.sentiment === PrismaSentiment.NEUTRAL) neu++;
        else neg++;

        const emo = p.emotion.toLowerCase();
        emotionsCount[emo] = (emotionsCount[emo] || 0) + 1;

        if (p.author.community?.name) {
          const cName = p.author.community.name;
          commCount[cName] = (commCount[cName] || 0) + 1;
        }

        platformsSet.add(p.platform.toLowerCase());
      });

      let dominantSentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
      if (pos >= neu && pos >= neg) dominantSentiment = 'positive';
      else if (neg >= pos && neg >= neu) dominantSentiment = 'negative';

      // 2. Dominant Emotion
      let dominantEmotion: 'anxiety' | 'excitement' | 'supportive' | 'opposition' | 'sarcasm' = 'anxiety';
      let maxEmoCount = 0;
      for (const [emo, count] of Object.entries(emotionsCount)) {
        if (count > maxEmoCount) {
          maxEmoCount = count;
          dominantEmotion = emo as any;
        }
      }

      // 3. Primary Community Name
      let communityName = 'General Civic Network';
      let maxCommCount = 0;
      for (const [cName, count] of Object.entries(commCount)) {
        if (count > maxCommCount) {
          maxCommCount = count;
          communityName = cName;
        }
      }

      // 4. Sparkline (8 temporal buckets)
      const sparkline = [0, 0, 0, 0, 0, 0, 0, 0];
      topicPosts.forEach((p) => {
        const offset = p.createdAt.getTime() - sinceDate.getTime();
        const idx = Math.min(bucketCount - 1, Math.max(0, Math.floor(offset / bucketDurationMs)));
        sparkline[idx]++;
      });

      // 5. Growth & Acceleration Calculation
      const recentVolume = sparkline.slice(4).reduce((a, b) => a + b, 0);
      const earlierVolume = sparkline.slice(0, 4).reduce((a, b) => a + b, 0);

      let accelerationPct = 0;
      if (earlierVolume > 0) {
        accelerationPct = Math.round(((recentVolume - earlierVolume) / earlierVolume) * 100);
      } else if (recentVolume > 0) {
        accelerationPct = 100;
      }

      // Accelerating indicator: recent activity is expanding with acceleration > 20%
      const isAccelerating = accelerationPct > 20 && recentVolume >= earlierVolume;

      return {
        id: topic.slug || topic.id,
        name: topic.name,
        volume,
        accelerationPct,
        sentiment: dominantSentiment,
        dominantEmotion,
        platforms: Array.from(platformsSet) as ('x' | 'telegram' | 'reddit' | 'youtube')[],
        communityName,
        sparkline,
        isAccelerating,
      };
    });

    // 6. Coordinates normalization for scatter landscape visualization
    const volumes = topicMetrics.map((t) => t.volume);
    const accels = topicMetrics.map((t) => t.accelerationPct);

    const minVol = Math.min(...volumes);
    const maxVol = Math.max(...volumes);
    const minAcc = Math.min(...accels);
    const maxAcc = Math.max(...accels);

    const items: TrendItemResult[] = topicMetrics.map((t) => {
      // Scale X (volume) to 18–86 range for clean viewport margin
      const x =
        maxVol > minVol
          ? Math.round(18 + ((t.volume - minVol) / (maxVol - minVol)) * 68)
          : 50;

      // Scale Y (acceleration) to 20–88 range
      const y =
        maxAcc > minAcc
          ? Math.round(20 + ((t.accelerationPct - minAcc) / (maxAcc - minAcc)) * 68)
          : 50;

      // Radius scaled 14–28 based on relative volume
      const radius =
        maxVol > 0
          ? Math.round(14 + (t.volume / maxVol) * 14)
          : 18;

      return {
        ...t,
        x,
        y,
        radius,
      };
    });

    // Sort by volume descending
    items.sort((a, b) => b.volume - a.volume);
    return items;
  }
}

export const trendService = new TrendService();
