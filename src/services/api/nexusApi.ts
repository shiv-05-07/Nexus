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
}

// Centralized API abstraction layer for NEXUS
// In production mode, this calls `fetch(\`${import.meta.env.VITE_API_URL}/...\`)`
export const nexusApi = {
  /**
   * Fetch complete overview brief
   */
  async getOverview(timeRange: TimeFilter = '24h', platform: Platform = 'all'): Promise<OverviewData> {
    await new Promise((r) => setTimeout(r, 60)); // Fast micro-tick for realistic async
    
    // Scale metrics logically if 10m or 7d or 30d
    let multiplier = 1;
    let sentimentBreakdown = { positive: 16, neutral: 21, negative: 63 };

    if (timeRange === '10m') {
      multiplier = 0.08;
      sentimentBreakdown = { positive: 12, neutral: 20, negative: 68 };
    } else if (timeRange === '1h') {
      multiplier = 0.22;
      sentimentBreakdown = { positive: 14, neutral: 23, negative: 63 };
    } else if (timeRange === '6h') {
      multiplier = 0.55;
      sentimentBreakdown = { positive: 15, neutral: 22, negative: 63 };
    } else if (timeRange === '7d') {
      multiplier = 4.8;
      sentimentBreakdown = { positive: 22, neutral: 28, negative: 50 };
    } else if (timeRange === '30d') {
      multiplier = 18.2;
      sentimentBreakdown = { positive: 28, neutral: 34, negative: 38 };
    }

    return {
      ...MOCK_OVERVIEW_DATA,
      sentimentBreakdown,
      metrics: {
        ...MOCK_OVERVIEW_DATA.metrics,
        totalPosts: Math.round(MOCK_OVERVIEW_DATA.metrics.totalPosts * multiplier),
        negativeSentimentPct: sentimentBreakdown.negative,
      }
    };
  },

  /**
   * Fetch current sentiment composition for donut visualization
   * Returns authoritative breakdown directly from centralized sentiment data layer
   */
  async getSentimentComposition(timeRange: TimeFilter = '24h'): Promise<SentimentComposition> {
    await new Promise((r) => setTimeout(r, 40));

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

    // Default 24H
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
   * Fetch sentiment over time series
   */
  async getSentimentTrends(timeRange: TimeFilter = '24h'): Promise<SentimentDataPoint[]> {
    await new Promise((r) => setTimeout(r, 40));
    return MOCK_SENTIMENT_SERIES;
  },

  /**
   * Fetch emotion breakdown
   */
  async getEmotionDistribution(): Promise<EmotionItem[]> {
    await new Promise((r) => setTimeout(r, 40));
    return MOCK_EMOTION_DISTRIBUTION;
  },

  /**
   * Fetch platform sentiment comparison
   */
  async getPlatformSentiment(): Promise<PlatformSentimentComparison[]> {
    await new Promise((r) => setTimeout(r, 40));
    return MOCK_PLATFORM_SENTIMENT;
  },

  /**
   * Fetch trend landscape scatter and ranked items
   */
  async getTrends(timeRange: TimeFilter = '24h', platform: Platform = 'all'): Promise<TrendItem[]> {
    await new Promise((r) => setTimeout(r, 50));
    return MOCK_TREND_ITEMS;
  },

  /**
   * Fetch network graph (nodes, edges, communities, summary) filtered by time horizon.
   * Architecture structured for direct backend endpoint: GET /network?days_back={daysBack}
   */
  async getNetwork(params?: GetNetworkParams | number): Promise<NetworkDatasetResult> {
    await new Promise((r) => setTimeout(r, 60));

    let daysBack = 1; // Default to 24H

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
    }

    // Centralized mock data layer filtering by timestamp
    return filterNetworkByDaysBack(daysBack);
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
