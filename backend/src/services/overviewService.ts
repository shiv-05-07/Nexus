import { Platform as PrismaPlatform, SentimentType as PrismaSentiment } from '@prisma/client';
import { prisma } from '../db/prisma';

export interface OverviewQueryParams {
  timeRange?: string;
  timeFilter?: string;
  daysBack?: number | string;
  platform?: string;
}

/**
 * Parses time filter parameters into daysBack number and string label.
 */
export function parseTimeFilter(
  timeRange?: string,
  timeFilter?: string,
  daysBackInput?: number | string
): { daysBack: number; timeLabel: string } {
  const filter = (timeRange || timeFilter || '').toLowerCase().trim();

  if (daysBackInput !== undefined && daysBackInput !== null && daysBackInput !== '') {
    const num = typeof daysBackInput === 'number' ? daysBackInput : parseFloat(daysBackInput);
    if (!isNaN(num) && num > 0) {
      return { daysBack: num, timeLabel: `${num}d` };
    }
  }

  switch (filter) {
    case '10m':
      return { daysBack: 10 / (24 * 60), timeLabel: '10m' };
    case '1h':
      return { daysBack: 1 / 24, timeLabel: '1h' };
    case '6h':
      return { daysBack: 6 / 24, timeLabel: '6h' };
    case '7d':
      return { daysBack: 7, timeLabel: '7d' };
    case '30d':
      return { daysBack: 30, timeLabel: '30d' };
    case '24h':
    default:
      return { daysBack: 1, timeLabel: '24h' };
  }
}

/**
 * Maps query platform filter string to Prisma Platform enum.
 */
export function mapPlatformFilter(platform?: string): PrismaPlatform | null {
  if (!platform || platform.toLowerCase() === 'all') return null;
  const p = platform.toUpperCase();
  if (p === 'X') return PrismaPlatform.X;
  if (p === 'TELEGRAM') return PrismaPlatform.TELEGRAM;
  if (p === 'REDDIT') return PrismaPlatform.REDDIT;
  if (p === 'YOUTUBE') return PrismaPlatform.YOUTUBE;
  return null;
}

/**
 * OverviewService: Pure database-derived analytical service for NEXUS Overview.
 *
 * Sourced entirely from PostgreSQL via Prisma:
 * - totalPosts: COUNT(Post) in time window
 * - activeTopicsCount: COUNT(DISTINCT Topic with posts in window)
 * - emergingGrowthPct: Derived strictly from temporal post volume delta between early/recent window buckets
 * - negativeSentimentPct: COUNT(Post where sentiment=NEGATIVE) / total
 * - narratives: Aggregated from Topic + Post + User tables
 * - sentimentBreakdown: PostgreSQL groupBy(Post.sentiment)
 * - audience: Empty / Not modeled (no demographic fabrication)
 * - networkSummary: COUNT(Community), COUNT(User) from PostgreSQL
 */
export class OverviewService {
  async getOverview(params: OverviewQueryParams) {
    const { daysBack } = parseTimeFilter(params.timeRange, params.timeFilter, params.daysBack);
    const platformFilter = mapPlatformFilter(params.platform);

    // Reference time: latest post in the database
    const latestPost = await prisma.post.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    });
    const refDate = latestPost ? latestPost.createdAt : new Date();
    const sinceDate = new Date(refDate.getTime() - daysBack * 86400 * 1000);

    const postWhere: {
      createdAt?: { gte: Date };
      platform?: PrismaPlatform;
    } = {
      createdAt: { gte: sinceDate },
    };

    if (platformFilter) {
      postWhere.platform = platformFilter;
    }

    // 1. Total Posts count in filtered window
    const totalPosts = await prisma.post.count({ where: postWhere });

    // 2. Sentiment Aggregation from real DB posts via groupBy
    const sentimentGroups = await prisma.post.groupBy({
      by: ['sentiment'],
      where: postWhere,
      _count: { id: true },
    });

    let positiveCount = 0;
    let neutralCount = 0;
    let negativeCount = 0;

    for (const group of sentimentGroups) {
      if (group.sentiment === PrismaSentiment.POSITIVE) positiveCount = group._count.id;
      if (group.sentiment === PrismaSentiment.NEUTRAL) neutralCount = group._count.id;
      if (group.sentiment === PrismaSentiment.NEGATIVE) negativeCount = group._count.id;
    }

    const calculatedTotal = positiveCount + neutralCount + negativeCount || (totalPosts > 0 ? totalPosts : 1);
    const positivePct = Math.round((positiveCount / calculatedTotal) * 100);
    const neutralPct = Math.round((neutralCount / calculatedTotal) * 100);
    const negativePct = calculatedTotal > 0 ? Math.max(0, 100 - positivePct - neutralPct) : 0;

    // 3. Topics and Emerging Narratives directly from PostgreSQL
    const topics = await prisma.topic.findMany({
      include: {
        posts: {
          where: postWhere,
          include: {
            author: {
              include: { community: true },
            },
          },
          orderBy: { reachScore: 'desc' },
        },
      },
    });

    // Filter to active topics with posts in this timeframe
    const activeTopics = topics.filter((t) => t.posts.length > 0);
    activeTopics.sort((a, b) => b.posts.length - a.posts.length);

    const narratives = activeTopics.map((topic) => {
      const topicPosts = topic.posts;
      const mentionCount = topicPosts.length;

      // Extract distinct platforms from topic posts
      const platformsSet = new Set<string>();
      topicPosts.forEach((p) => platformsSet.add(p.platform.toLowerCase()));
      const platforms = Array.from(platformsSet) as ('x' | 'telegram' | 'reddit' | 'youtube')[];

      // Calculate dominant sentiment & emotion from actual posts
      let pos = 0;
      let neu = 0;
      let neg = 0;
      const emotionsCount: Record<string, number> = {};

      topicPosts.forEach((p) => {
        if (p.sentiment === PrismaSentiment.POSITIVE) pos++;
        else if (p.sentiment === PrismaSentiment.NEUTRAL) neu++;
        else neg++;

        const emo = p.emotion.toLowerCase();
        emotionsCount[emo] = (emotionsCount[emo] || 0) + 1;
      });

      let dominantSentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
      if (pos >= neu && pos >= neg) dominantSentiment = 'positive';
      else if (neg >= pos && neg >= neu) dominantSentiment = 'negative';

      let dominantEmotion: 'anxiety' | 'excitement' | 'supportive' | 'opposition' | 'sarcasm' = 'anxiety';
      let maxEmoCount = 0;
      for (const [emo, count] of Object.entries(emotionsCount)) {
        if (count > maxEmoCount) {
          maxEmoCount = count;
          dominantEmotion = emo as any;
        }
      }

      // Compute 8-point temporal sparkline across the window
      const sparkline = [0, 0, 0, 0, 0, 0, 0, 0];
      const windowMs = daysBack * 86400 * 1000;
      const bucketMs = windowMs / 8;

      topicPosts.forEach((p) => {
        const offset = p.createdAt.getTime() - sinceDate.getTime();
        const bucketIndex = Math.min(7, Math.max(0, Math.floor(offset / bucketMs)));
        sparkline[bucketIndex]++;
      });

      // Growth percentage and acceleration strictly derived from early vs recent buckets
      const recentBuckets = sparkline.slice(4).reduce((a, b) => a + b, 0);
      const earlyBuckets = sparkline.slice(0, 4).reduce((a, b) => a + b, 0);
      
      let growthPct = 0;
      if (earlyBuckets > 0) {
        growthPct = Math.round(((recentBuckets - earlyBuckets) / earlyBuckets) * 100);
      } else if (recentBuckets > 0) {
        growthPct = 100;
      }

      const accelerationScore = earlyBuckets > 0
        ? parseFloat((recentBuckets / earlyBuckets).toFixed(1))
        : (recentBuckets > 0 ? 1.0 : 0.0);

      // Key Quotes from top posts in this topic
      const keyQuotes = topicPosts.slice(0, 2).map((p) => ({
        author: p.author.handle,
        platform: p.platform.toLowerCase() as 'x' | 'telegram' | 'reddit' | 'youtube',
        text: p.content,
        timestamp: p.createdAt.toISOString().substring(11, 16) + ' UTC',
      }));

      // Community IDs associated with this topic's authors
      const commSet = new Set<string>();
      topicPosts.forEach((p) => {
        if (p.author.communityId) commSet.add(p.author.communityId);
      });

      return {
        id: topic.slug || topic.id,
        name: topic.name,
        summary: topic.description,
        growthPct,
        mentionCount,
        sentiment: dominantSentiment,
        dominantEmotion,
        platforms,
        sparkline,
        accelerationScore,
        firstObserved: topic.firstObservedAt
          ? `${topic.firstObservedAt.toISOString().substring(11, 16)} UTC`
          : (topicPosts[topicPosts.length - 1]?.createdAt.toISOString().substring(11, 16) + ' UTC' || '00:00 UTC'),
        lastObserved: topic.lastObservedAt
          ? `${topic.lastObservedAt.toISOString().substring(11, 16)} UTC`
          : (topicPosts[0]?.createdAt.toISOString().substring(11, 16) + ' UTC' || '00:00 UTC'),
        communityIds: Array.from(commSet),
        keyQuotes,
      };
    });

    // 4. Communities and Network Node counts from database
    const [communityCount, totalUsersCount] = await Promise.all([
      prisma.community.count(),
      prisma.user.count({
        where: platformFilter ? { platform: platformFilter } : undefined,
      }),
    ]);

    const lastUpdatedSecondsAgo = latestPost
      ? Math.max(0, Math.round((Date.now() - latestPost.createdAt.getTime()) / 1000))
      : 0;

    return {
      metrics: {
        totalPosts,
        activeTopicsCount: activeTopics.length,
        emergingGrowthPct: narratives.length > 0 ? narratives[0].growthPct : 0,
        negativeSentimentPct: negativePct,
        lastUpdatedSecondsAgo,
      },
      narratives,
      sentimentBreakdown: {
        positive: positivePct,
        neutral: neutralPct,
        negative: negativePct,
      },
      // Note: Demographic inference is not modeled in the current schema.
      audience: {
        ageGroups: [],
        languages: [],
        regions: [],
        methodologyNote: 'Demographic and cohort inference is not modeled in the current schema.',
      },
      networkSummary: {
        activeCommunities: communityCount,
        bridgeNodesCount: 0, // Bridge node calculation is computed in Phase 2E Network Graph analytics
        monitoredNodes: totalUsersCount,
      },
    };
  }
}

export const overviewService = new OverviewService();
