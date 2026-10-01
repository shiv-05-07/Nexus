import {
  Platform as PrismaPlatform,
  SentimentType as PrismaSentiment,
  EmotionType as PrismaEmotion,
  Prisma,
} from '@prisma/client';
import { prisma } from '../db/prisma';
import { parseTimeFilter, mapPlatformFilter } from './overviewService';

export interface SentimentQueryParams {
  timeRange?: string;
  timeFilter?: string;
  daysBack?: number | string;
  platform?: string;
}

export interface SentimentCompositionResult {
  positive: number;
  neutral: number;
  negative: number;
  totalAnalyzed: number;
  dominantSentiment: 'positive' | 'neutral' | 'negative';
  description: string;
}

export interface SentimentDataPointResult {
  timestamp: string;
  timeLabel: string;
  positive: number;
  neutral: number;
  negative: number;
  volume: number;
}

export interface EmotionItemResult {
  emotion: 'anxiety' | 'excitement' | 'supportive' | 'opposition' | 'sarcasm';
  label: string;
  percentage: number;
  volume: number;
  trendDelta: string;
  description: string;
}

export interface PlatformSentimentComparisonResult {
  platform: 'x' | 'telegram' | 'reddit' | 'youtube';
  platformName: string;
  positivePct: number;
  neutralPct: number;
  negativePct: number;
  totalVolume: number;
}

const EMOTION_META: Record<
  string,
  { label: string; description: string }
> = {
  anxiety: {
    label: 'Anxiety & Commuter Distress',
    description: 'Concerns regarding service disruptions, safety advisories, and sudden scheduling changes.',
  },
  supportive: {
    label: 'Supportive & Community Coordination',
    description: 'Mutual aid carpooling initiatives, civic volunteer marshaling, and peer route guidance.',
  },
  opposition: {
    label: 'Opposition & Policy Pushback',
    description: 'Demands for administrative accountability, fare revision petitions, and union critiques.',
  },
  excitement: {
    label: 'Excitement & Reform Optimism',
    description: 'Positive reception toward transit modernization, digital ticketing, and infrastructure upgrades.',
  },
  sarcasm: {
    label: 'Sarcasm & Public Irony',
    description: 'Satirical commentary, ironic humor regarding delays, and municipal parody posts.',
  },
};

const PLATFORM_NAMES: Record<string, string> = {
  x: 'X (Twitter)',
  telegram: 'Telegram',
  reddit: 'Reddit',
  youtube: 'YouTube',
};

export class SentimentService {
  /**
   * Helper to build base time window & where filter
   */
  private async buildFilterContext(params: SentimentQueryParams) {
    const { daysBack, timeLabel } = parseTimeFilter(params.timeRange, params.timeFilter, params.daysBack);
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

    return { daysBack, timeLabel, platformFilter, refDate, sinceDate, postWhere };
  }

  /**
   * 1. Current Sentiment Composition (Donut)
   */
  async getComposition(params: SentimentQueryParams): Promise<SentimentCompositionResult> {
    const { postWhere, timeLabel, platformFilter } = await this.buildFilterContext(params);

    const [totalAnalyzed, sentimentGroups] = await Promise.all([
      prisma.post.count({ where: postWhere }),
      prisma.post.groupBy({
        by: ['sentiment'],
        where: postWhere,
        _count: { id: true },
      }),
    ]);

    let positiveCount = 0;
    let neutralCount = 0;
    let negativeCount = 0;

    for (const group of sentimentGroups) {
      if (group.sentiment === PrismaSentiment.POSITIVE) positiveCount = group._count.id;
      if (group.sentiment === PrismaSentiment.NEUTRAL) neutralCount = group._count.id;
      if (group.sentiment === PrismaSentiment.NEGATIVE) negativeCount = group._count.id;
    }

    const calculatedTotal = positiveCount + neutralCount + negativeCount || (totalAnalyzed > 0 ? totalAnalyzed : 1);
    const positive = Math.round((positiveCount / calculatedTotal) * 100);
    const neutral = Math.round((neutralCount / calculatedTotal) * 100);
    const negative = calculatedTotal > 0 ? Math.max(0, 100 - positive - neutral) : 0;

    let dominantSentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    if (positive >= neutral && positive >= negative) dominantSentiment = 'positive';
    else if (negative >= positive && negative >= neutral) dominantSentiment = 'negative';

    // Contextual description derived from the dataset findings
    const platformStr = platformFilter ? ` on ${PLATFORM_NAMES[platformFilter.toLowerCase()] || platformFilter}` : '';
    let description = `Analysis of ${totalAnalyzed.toLocaleString()} verified posts${platformStr} over the ${timeLabel} window shows ${dominantSentiment} polarity predominating.`;
    if (negative > 50) {
      description = `Disruption reports and accountability demands drive negative sentiment (${negative}%), while peer coordination channels provide emerging positive balance.`;
    } else if (positive > 40) {
      description = `Constructive civic feedback and community mutual-aid coordination elevate positive sentiment (${positive}%).`;
    }

    return {
      positive,
      neutral,
      negative,
      totalAnalyzed,
      dominantSentiment,
      description,
    };
  }

  /**
   * 2. Sentiment Time Series (Trends Over Time)
   */
  async getTrends(params: SentimentQueryParams): Promise<SentimentDataPointResult[]> {
    const { daysBack, postWhere, refDate, sinceDate } = await this.buildFilterContext(params);

    // Determine bucket granularity
    let bucketCount = 8;
    if (daysBack <= 10 / (24 * 60)) {
      bucketCount = 6; // 10m
    } else if (daysBack <= 1 / 24) {
      bucketCount = 5; // 1h
    } else if (daysBack <= 7) {
      bucketCount = 7; // 7d (daily)
    } else if (daysBack <= 30) {
      bucketCount = 5; // 30d (weekly)
    }

    const windowMs = refDate.getTime() - sinceDate.getTime();
    const bucketDurationMs = windowMs / bucketCount;

    // Fetch all posts in window with sentiment & createdAt
    const posts = await prisma.post.findMany({
      where: postWhere,
      select: {
        createdAt: true,
        sentiment: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // Initialize buckets
    const buckets: {
      timestamp: Date;
      timeLabel: string;
      positive: number;
      neutral: number;
      negative: number;
      volume: number;
    }[] = [];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < bucketCount; i++) {
      const bucketStart = new Date(sinceDate.getTime() + i * bucketDurationMs);
      let timeLabel = '';

      if (daysBack <= 10 / (24 * 60)) {
        const minsAgo = Math.round((bucketCount - 1 - i) * 2);
        timeLabel = minsAgo === 0 ? 'Now' : `-${minsAgo}m`;
      } else if (daysBack <= 1) {
        timeLabel = bucketStart.toISOString().substring(11, 16);
      } else if (daysBack <= 7) {
        timeLabel = dayNames[bucketStart.getUTCDay()];
      } else {
        timeLabel = `W${i + 1}`;
      }

      buckets.push({
        timestamp: bucketStart,
        timeLabel,
        positive: 0,
        neutral: 0,
        negative: 0,
        volume: 0,
      });
    }

    // Distribute posts into buckets
    posts.forEach((p) => {
      const offset = p.createdAt.getTime() - sinceDate.getTime();
      const idx = Math.min(bucketCount - 1, Math.max(0, Math.floor(offset / bucketDurationMs)));
      const b = buckets[idx];
      b.volume++;
      if (p.sentiment === PrismaSentiment.POSITIVE) b.positive++;
      else if (p.sentiment === PrismaSentiment.NEUTRAL) b.neutral++;
      else if (p.sentiment === PrismaSentiment.NEGATIVE) b.negative++;
    });

    // Convert raw bucket counts to normalized percentage series
    return buckets.map((b) => {
      const vol = b.volume;
      const posPct = vol > 0 ? Math.round((b.positive / vol) * 100) : 0;
      const neuPct = vol > 0 ? Math.round((b.neutral / vol) * 100) : 0;
      const negPct = vol > 0 ? Math.max(0, 100 - posPct - neuPct) : 0;

      return {
        timestamp: b.timestamp.toISOString(),
        timeLabel: b.timeLabel,
        positive: posPct,
        neutral: neuPct,
        negative: negPct,
        volume: vol,
      };
    });
  }

  /**
   * 3. Emotion Distribution from PostgreSQL Post.emotion
   */
  async getEmotions(params: SentimentQueryParams): Promise<EmotionItemResult[]> {
    const { postWhere, sinceDate, refDate } = await this.buildFilterContext(params);

    const [totalPosts, emotionGroups, allPosts] = await Promise.all([
      prisma.post.count({ where: postWhere }),
      prisma.post.groupBy({
        by: ['emotion'],
        where: postWhere,
        _count: { id: true },
      }),
      prisma.post.findMany({
        where: postWhere,
        select: {
          emotion: true,
          createdAt: true,
        },
      }),
    ]);

    // Calculate temporal delta by splitting window into earlier and recent halves
    const midpoint = new Date(sinceDate.getTime() + (refDate.getTime() - sinceDate.getTime()) / 2);
    const earlyCounts: Record<string, number> = {};
    const recentCounts: Record<string, number> = {};

    allPosts.forEach((p) => {
      const emoKey = p.emotion.toLowerCase();
      if (p.createdAt >= midpoint) {
        recentCounts[emoKey] = (recentCounts[emoKey] || 0) + 1;
      } else {
        earlyCounts[emoKey] = (earlyCounts[emoKey] || 0) + 1;
      }
    });

    const emotionMap: Record<string, number> = {};
    emotionGroups.forEach((g) => {
      emotionMap[g.emotion.toLowerCase()] = g._count.id;
    });

    const definedEmotions: ('anxiety' | 'excitement' | 'supportive' | 'opposition' | 'sarcasm')[] = [
      'anxiety',
      'supportive',
      'opposition',
      'excitement',
      'sarcasm',
    ];

    const results: EmotionItemResult[] = definedEmotions.map((emoKey) => {
      const vol = emotionMap[emoKey] || 0;
      const percentage = totalPosts > 0 ? Math.round((vol / totalPosts) * 100) : 0;
      const early = earlyCounts[emoKey] || 0;
      const recent = recentCounts[emoKey] || 0;

      let deltaPct = 0;
      if (early > 0) {
        deltaPct = Math.round(((recent - early) / early) * 100);
      } else if (recent > 0) {
        deltaPct = 100;
      }

      const meta = EMOTION_META[emoKey] || {
        label: emoKey,
        description: 'Aggregate emotional discourse signal.',
      };

      return {
        emotion: emoKey,
        label: meta.label,
        percentage,
        volume: vol,
        trendDelta: `${deltaPct >= 0 ? '+' : ''}${deltaPct}% vs prior period`,
        description: meta.description,
      };
    });

    // Sort by volume descending
    results.sort((a, b) => b.volume - a.volume);
    return results;
  }

  /**
   * 4. Platform Sentiment Comparison from PostgreSQL
   */
  async getPlatformComparison(params: SentimentQueryParams): Promise<PlatformSentimentComparisonResult[]> {
    const { daysBack, refDate, sinceDate, platformFilter } = await this.buildFilterContext(params);

    const platforms: PrismaPlatform[] = platformFilter
      ? [platformFilter]
      : [PrismaPlatform.REDDIT, PrismaPlatform.TELEGRAM, PrismaPlatform.X, PrismaPlatform.YOUTUBE];

    const results: PlatformSentimentComparisonResult[] = [];

    for (const p of platforms) {
      const pWhere: Prisma.PostWhereInput = {
        platform: p,
        createdAt: { gte: sinceDate },
      };

      const [totalVolume, sentimentGroups] = await Promise.all([
        prisma.post.count({ where: pWhere }),
        prisma.post.groupBy({
          by: ['sentiment'],
          where: pWhere,
          _count: { id: true },
        }),
      ]);

      let posCount = 0;
      let neuCount = 0;
      let negCount = 0;

      for (const g of sentimentGroups) {
        if (g.sentiment === PrismaSentiment.POSITIVE) posCount = g._count.id;
        if (g.sentiment === PrismaSentiment.NEUTRAL) neuCount = g._count.id;
        if (g.sentiment === PrismaSentiment.NEGATIVE) negCount = g._count.id;
      }

      const sum = posCount + neuCount + negCount || (totalVolume > 0 ? totalVolume : 1);
      const positivePct = Math.round((posCount / sum) * 100);
      const neutralPct = Math.round((neuCount / sum) * 100);
      const negativePct = sum > 0 ? Math.max(0, 100 - positivePct - neutralPct) : 0;

      const pKey = p.toLowerCase() as 'x' | 'telegram' | 'reddit' | 'youtube';

      results.push({
        platform: pKey,
        platformName: PLATFORM_NAMES[pKey] || p,
        positivePct,
        neutralPct,
        negativePct,
        totalVolume,
      });
    }

    results.sort((a, b) => b.totalVolume - a.totalVolume);
    return results;
  }

  /**
   * Unified sentiment payload
   */
  async getFullSentiment(params: SentimentQueryParams) {
    const [composition, trends, emotions, platformComparison] = await Promise.all([
      this.getComposition(params),
      this.getTrends(params),
      this.getEmotions(params),
      this.getPlatformComparison(params),
    ]);

    return {
      composition,
      trends,
      emotions,
      platformComparison,
    };
  }
}

export const sentimentService = new SentimentService();
