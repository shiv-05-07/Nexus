import {
  AudienceAggregate,
  EmergingNarrative,
  EmotionItem,
  NetworkCommunity,
  NetworkEdge,
  NetworkNode,
  OverviewData,
  Platform,
  PlatformSentimentComparison,
  SentimentDataPoint,
  SentimentType,
  TimeFilter,
  TimelineEvent,
  TrendItem
} from '../../types/nexus';
import { MOCK_OVERVIEW_DATA } from '../../data/mock/overviewData';
import { MOCK_TIMELINE_EVENTS } from '../../data/mock/timelineData';
import {
  MOCK_EMOTION_DISTRIBUTION,
  MOCK_PLATFORM_SENTIMENT,
  MOCK_SENTIMENT_SERIES
} from '../../data/mock/sentimentData';
import { MOCK_TREND_ITEMS } from '../../data/mock/trendsData';
import {
  filterNetworkByDaysBack,
  MOCK_COMMUNITIES,
  MOCK_NETWORK_NODES,
  NetworkDatasetResult
} from '../../data/mock/networkData';

export interface SentimentComposition {
  positive: number;
  neutral: number;
  negative: number;
  totalAnalyzed: number;
  dominantSentiment: SentimentType;
  description: string;
}

export interface GetNetworkParams {
  daysBack?: number;
  timeFilter?: TimeFilter;
  platform?: Platform;
  platformFilter?: Platform;
}

// Centralized API abstraction layer for NEXUS
// In production mode, this calls `fetch(\`${import.meta.env.VITE_API_URL}/...\`)`
export const nexusApi = {
  /**
   * Fetch complete overview brief filtered by timeRange and platform
   */
  async getOverview(timeRange: TimeFilter = '24h', platform: Platform = 'all'): Promise<OverviewData> {
    await new Promise((r) => setTimeout(r, 60)); // Fast micro-tick for realistic async

    // Base multiplier by time horizon
    let timeMultiplier = 1;
    if (timeRange === '10m') timeMultiplier = 0.08;
    else if (timeRange === '1h') timeMultiplier = 0.22;
    else if (timeRange === '6h') timeMultiplier = 0.55;
    else if (timeRange === '7d') timeMultiplier = 4.8;
    else if (timeRange === '30d') timeMultiplier = 18.2;

    // Filter narratives by platform: if platform is selected, narratives not active on it are excluded
    let filteredNarratives = [...MOCK_OVERVIEW_DATA.narratives];
    if (platform !== 'all') {
      filteredNarratives = filteredNarratives
        .filter((n) => n.platforms.includes(platform))
        .map((n) => ({
          ...n,
          // Only show quotes from the selected platform
          keyQuotes: n.keyQuotes.filter((q) => q.platform === platform),
        }));
    }

    // Platform-specific metrics & sentiment breakdown
    let basePosts = MOCK_OVERVIEW_DATA.metrics.totalPosts;
    let sentimentBreakdown = { positive: 16, neutral: 21, negative: 63 };

    if (platform === 'telegram') {
      basePosts = 4180;
      sentimentBreakdown = { positive: 12, neutral: 18, negative: 70 };
    } else if (platform === 'reddit') {
      basePosts = 3420;
      sentimentBreakdown = { positive: 15, neutral: 22, negative: 63 };
    } else if (platform === 'x') {
      basePosts = 4350;
      sentimentBreakdown = { positive: 20, neutral: 19, negative: 61 };
    } else if (platform === 'youtube') {
      basePosts = 892;
      sentimentBreakdown = { positive: 28, neutral: 34, negative: 38 };
    } else {
      // All platforms
      if (timeRange === '10m') sentimentBreakdown = { positive: 12, neutral: 20, negative: 68 };
      else if (timeRange === '1h') sentimentBreakdown = { positive: 14, neutral: 23, negative: 63 };
      else if (timeRange === '7d') sentimentBreakdown = { positive: 22, neutral: 28, negative: 50 };
      else if (timeRange === '30d') sentimentBreakdown = { positive: 28, neutral: 34, negative: 38 };
    }

    return {
      ...MOCK_OVERVIEW_DATA,
      narratives: filteredNarratives,
      sentimentBreakdown,
      metrics: {
        ...MOCK_OVERVIEW_DATA.metrics,
        totalPosts: Math.round(basePosts * timeMultiplier),
        activeTopicsCount: filteredNarratives.length,
        negativeSentimentPct: sentimentBreakdown.negative,
      }
    };
  },

  /**
   * Fetch current sentiment composition for donut visualization aligned to platform and timeRange
   */
  async getSentimentComposition(
    timeRange: TimeFilter = '24h',
    platform: Platform = 'all'
  ): Promise<SentimentComposition> {
    await new Promise((r) => setTimeout(r, 40));

    // 1. Specific platform composition
    if (platform === 'telegram') {
      return {
        positive: 12,
        neutral: 18,
        negative: 70,
        totalAnalyzed: 4180,
        dominantSentiment: 'negative',
        description: 'Telegram groups & dispatch channels emphasize driver union bulletins, route stoppages, and commuter mutual aid.'
      };
    }
    if (platform === 'reddit') {
      return {
        positive: 15,
        neutral: 22,
        negative: 63,
        totalAnalyzed: 3420,
        dominantSentiment: 'negative',
        description: 'Reddit community megathreads scrutinize fare hike revisions, alternative IT shuttles, and regulatory accountability.'
      };
    }
    if (platform === 'x') {
      return {
        positive: 20,
        neutral: 19,
        negative: 61,
        totalAnalyzed: 4350,
        dominantSentiment: 'negative',
        description: 'X (Twitter) feeds feature live photojournalism of terminal congestion, citizen complaints, and official press releases.'
      };
    }
    if (platform === 'youtube') {
      return {
        positive: 28,
        neutral: 34,
        negative: 38,
        totalAnalyzed: 892,
        dominantSentiment: 'negative',
        description: 'YouTube broadcasts spotlight in-depth municipal hearings, healthcare policy panel debates, and transit analysis.'
      };
    }

    // 2. Global cross-platform composition
    if (timeRange === '10m') {
      return {
        positive: 12,
        neutral: 20,
        negative: 68,
        totalAnalyzed: 940,
        dominantSentiment: 'negative',
        description: 'Peak ten-minute surge in user reports regarding morning rush-hour terminal delays.'
      };
    }
    if (timeRange === '1h') {
      return {
        positive: 14,
        neutral: 23,
        negative: 63,
        totalAnalyzed: 2820,
        dominantSentiment: 'negative',
        description: 'Immediate hourly discourse is sharply focused on real-time transit stoppage announcements.'
      };
    }
    if (timeRange === '7d') {
      return {
        positive: 22,
        neutral: 28,
        negative: 50,
        totalAnalyzed: 54200,
        dominantSentiment: 'negative',
        description: 'Weekly public debate shows moderate consolidation around transit negotiations and municipal reform.'
      };
    }
    if (timeRange === '30d') {
      return {
        positive: 28,
        neutral: 34,
        negative: 38,
        totalAnalyzed: 184500,
        dominantSentiment: 'negative',
        description: 'Monthly macro sentiment reveals balanced discourse across civic improvements and public transit policy.'
      };
    }

    return {
      positive: 16,
      neutral: 21,
      negative: 63,
      totalAnalyzed: 12842,
      dominantSentiment: 'negative',
      description: 'Transit disruption distress dominates negative polarity, while volunteer carpool mutual-aid channels offer emerging positive balance.'
    };
  },

  /**
   * Fetch chronological timeline events with filtering
   */
  async getTimeline(params?: {
    platform?: Platform;
    sentiment?: string;
    topicId?: string;
    searchQuery?: string;
  }): Promise<TimelineEvent[]> {
    await new Promise((r) => setTimeout(r, 50));
    let events = [...MOCK_TIMELINE_EVENTS];

    if (params?.platform && params.platform !== 'all') {
      events = events.filter((e) => e.platform === params.platform);
    }
    if (params?.sentiment && params.sentiment !== 'all') {
      events = events.filter((e) => e.sentiment === params.sentiment);
    }
    if (params?.topicId) {
      events = events.filter((e) => e.topicId === params.topicId);
    }
    if (params?.searchQuery && params.searchQuery.trim()) {
      const q = params.searchQuery.toLowerCase();
      events = events.filter(
        (e) =>
          e.content.toLowerCase().includes(q) ||
          e.authorHandle.toLowerCase().includes(q) ||
          e.topicName.toLowerCase().includes(q)
      );
    }

    return events;
  },

  /**
   * Fetch sentiment over time series aligned to active time horizon and platform
   */
  async getSentimentTrends(
    timeRange: TimeFilter = '24h',
    platform: Platform = 'all'
  ): Promise<SentimentDataPoint[]> {
    await new Promise((r) => setTimeout(r, 40));

    // Base trends per time horizon
    let baseSeries = MOCK_SENTIMENT_SERIES;
    if (timeRange === '10m') {
      baseSeries = [
        { timestamp: '2026-10-01T08:50:00Z', timeLabel: '-10m', positive: 14, neutral: 22, negative: 64, volume: 80 },
        { timestamp: '2026-10-01T08:52:00Z', timeLabel: '-8m', positive: 13, neutral: 21, negative: 66, volume: 110 },
        { timestamp: '2026-10-01T08:54:00Z', timeLabel: '-6m', positive: 12, neutral: 20, negative: 68, volume: 140 },
        { timestamp: '2026-10-01T08:56:00Z', timeLabel: '-4m', positive: 11, neutral: 19, negative: 70, volume: 185 },
        { timestamp: '2026-10-01T08:58:00Z', timeLabel: '-2m', positive: 12, neutral: 20, negative: 68, volume: 225 },
        { timestamp: '2026-10-01T09:00:00Z', timeLabel: 'Now', positive: 12, neutral: 20, negative: 68, volume: 200 },
      ];
    } else if (timeRange === '1h') {
      baseSeries = [
        { timestamp: '2026-10-01T08:00:00Z', timeLabel: '08:00', positive: 18, neutral: 26, negative: 56, volume: 380 },
        { timestamp: '2026-10-01T08:15:00Z', timeLabel: '08:15', positive: 16, neutral: 24, negative: 60, volume: 540 },
        { timestamp: '2026-10-01T08:30:00Z', timeLabel: '08:30', positive: 14, neutral: 22, negative: 64, volume: 720 },
        { timestamp: '2026-10-01T08:45:00Z', timeLabel: '08:45', positive: 13, neutral: 23, negative: 64, volume: 610 },
        { timestamp: '2026-10-01T09:00:00Z', timeLabel: '09:00', positive: 14, neutral: 23, negative: 63, volume: 570 },
      ];
    } else if (timeRange === '7d') {
      baseSeries = [
        { timestamp: '2026-09-25T00:00:00Z', timeLabel: 'Fri', positive: 26, neutral: 34, negative: 40, volume: 6800 },
        { timestamp: '2026-09-26T00:00:00Z', timeLabel: 'Sat', positive: 28, neutral: 36, negative: 36, volume: 4900 },
        { timestamp: '2026-09-27T00:00:00Z', timeLabel: 'Sun', positive: 30, neutral: 38, negative: 32, volume: 4200 },
        { timestamp: '2026-09-28T00:00:00Z', timeLabel: 'Mon', positive: 20, neutral: 28, negative: 52, volume: 8100 },
        { timestamp: '2026-09-29T00:00:00Z', timeLabel: 'Tue', positive: 18, neutral: 26, negative: 56, volume: 9400 },
        { timestamp: '2026-09-30T00:00:00Z', timeLabel: 'Wed', positive: 19, neutral: 25, negative: 56, volume: 10200 },
        { timestamp: '2026-10-01T00:00:00Z', timeLabel: 'Thu', positive: 22, neutral: 28, negative: 50, volume: 10600 },
      ];
    } else if (timeRange === '30d') {
      baseSeries = [
        { timestamp: '2026-09-02T00:00:00Z', timeLabel: 'W1', positive: 32, neutral: 38, negative: 30, volume: 32000 },
        { timestamp: '2026-09-09T00:00:00Z', timeLabel: 'W2', positive: 30, neutral: 36, negative: 34, volume: 38000 },
        { timestamp: '2026-09-16T00:00:00Z', timeLabel: 'W3', positive: 29, neutral: 35, negative: 36, volume: 36000 },
        { timestamp: '2026-09-23T00:00:00Z', timeLabel: 'W4', positive: 27, neutral: 33, negative: 40, volume: 41000 },
        { timestamp: '2026-09-30T00:00:00Z', timeLabel: 'W5', positive: 28, neutral: 34, negative: 38, volume: 37500 },
      ];
    }

    // Platform sentiment bias adjustment
    if (platform === 'telegram') {
      return baseSeries.map((d) => ({
        ...d,
        positive: Math.max(8, d.positive - 4),
        neutral: Math.max(12, d.neutral - 3),
        negative: Math.min(80, d.negative + 7),
        volume: Math.round(d.volume * 0.32),
      }));
    }
    if (platform === 'reddit') {
      return baseSeries.map((d) => ({
        ...d,
        positive: Math.max(10, d.positive - 1),
        neutral: Math.max(15, d.neutral + 1),
        negative: d.negative,
        volume: Math.round(d.volume * 0.27),
      }));
    }
    if (platform === 'x') {
      return baseSeries.map((d) => ({
        ...d,
        positive: Math.min(30, d.positive + 4),
        neutral: Math.max(14, d.neutral - 2),
        negative: Math.max(45, d.negative - 2),
        volume: Math.round(d.volume * 0.34),
      }));
    }
    if (platform === 'youtube') {
      return baseSeries.map((d) => ({
        ...d,
        positive: Math.min(40, d.positive + 12),
        neutral: Math.min(45, d.neutral + 13),
        negative: Math.max(20, d.negative - 25),
        volume: Math.round(d.volume * 0.07),
      }));
    }

    return baseSeries;
  },

  /**
   * Fetch emotion breakdown filtered by platform
   */
  async getEmotionDistribution(platform: Platform = 'all'): Promise<EmotionItem[]> {
    await new Promise((r) => setTimeout(r, 40));
    if (platform === 'telegram') {
      return MOCK_EMOTION_DISTRIBUTION.map((e) =>
        e.emotion === 'anxiety'
          ? { ...e, percentage: 46, volume: Math.round(e.volume * 0.38) }
          : e.emotion === 'supportive'
          ? { ...e, percentage: 26, volume: Math.round(e.volume * 0.42) }
          : { ...e, percentage: Math.max(4, Math.round(e.percentage * 0.7)), volume: Math.round(e.volume * 0.3) }
      );
    }
    return MOCK_EMOTION_DISTRIBUTION;
  },

  /**
   * Fetch platform sentiment comparison.
   * If a specific platform is selected, ONLY that platform is returned!
   */
  async getPlatformSentiment(platform: Platform = 'all'): Promise<PlatformSentimentComparison[]> {
    await new Promise((r) => setTimeout(r, 40));
    if (platform !== 'all') {
      return MOCK_PLATFORM_SENTIMENT.filter((p) => p.platform === platform);
    }
    return MOCK_PLATFORM_SENTIMENT;
  },

  /**
   * Fetch trend landscape scatter and ranked items filtered by platform
   * Items not including the selected platform are excluded.
   */
  async getTrends(timeRange: TimeFilter = '24h', platform: Platform = 'all'): Promise<TrendItem[]> {
    await new Promise((r) => setTimeout(r, 50));
    if (platform !== 'all') {
      return MOCK_TREND_ITEMS.filter((item) => item.platforms.includes(platform));
    }
    return MOCK_TREND_ITEMS;
  },

  /**
   * Fetch network graph (nodes, edges, communities, summary) filtered by time horizon and platform.
   * If platform is selected (e.g. 'telegram'), nodes and groups not including telegram are excluded.
   */
  async getNetwork(params?: GetNetworkParams | number): Promise<NetworkDatasetResult> {
    await new Promise((r) => setTimeout(r, 60));

    let daysBack = 1; // Default to 24H
    let platformFilter: Platform = 'all';

    if (typeof params === 'number') {
      daysBack = params;
    } else if (params) {
      if (typeof params.daysBack === 'number') {
        daysBack = params.daysBack;
      } else if (params.timeFilter) {
        if (params.timeFilter === '10m') daysBack = 10 / (24 * 60);
        else if (params.timeFilter === '1h') daysBack = 1 / 24;
        else if (params.timeFilter === '6h') daysBack = 0.25;
        else if (params.timeFilter === '24h') daysBack = 1;
        else if (params.timeFilter === '7d') daysBack = 7;
        else if (params.timeFilter === '30d') daysBack = 30;
      }

      if (params.platform) platformFilter = params.platform;
      else if (params.platformFilter) platformFilter = params.platformFilter;
    }

    return filterNetworkByDaysBack(daysBack, platformFilter);
  },

  /**
   * Fetch single narrative details
   */
  async getNarrativeDetail(id: string): Promise<EmergingNarrative | null> {
    await new Promise((r) => setTimeout(r, 30));
    const found = MOCK_OVERVIEW_DATA.narratives.find((n) => n.id === id);
    return found || null;
  },

  /**
   * Fetch single node details
   */
  async getNodeDetail(id: string): Promise<NetworkNode | null> {
    await new Promise((r) => setTimeout(r, 30));
    const found = MOCK_NETWORK_NODES.find((n) => n.id === id);
    return found || null;
  }
};
