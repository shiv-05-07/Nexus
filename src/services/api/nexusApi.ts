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
  MOCK_COMMUNITIES,
  MOCK_NETWORK_EDGES,
  MOCK_NETWORK_NODES
} from '../../data/mock/networkData';

// Centralized API abstraction layer for NEXUS
// In future production mode, this calls `fetch(\`\${import.meta.env.VITE_API_URL}/...\`)`
export const nexusApi = {
  /**
   * Fetch complete overview brief
   */
  async getOverview(timeRange: TimeFilter = '24h', platform: Platform = 'all'): Promise<OverviewData> {
    await new Promise((r) => setTimeout(r, 60)); // Fast micro-tick for realistic async
    
    // Scale metrics logically if 10m or 7d
    let multiplier = 1;
    if (timeRange === '10m') multiplier = 0.08;
    if (timeRange === '1h') multiplier = 0.22;
    if (timeRange === '6h') multiplier = 0.55;
    if (timeRange === '7d') multiplier = 4.8;
    if (timeRange === '30d') multiplier = 18.2;

    return {
      ...MOCK_OVERVIEW_DATA,
      metrics: {
        ...MOCK_OVERVIEW_DATA.metrics,
        totalPosts: Math.round(MOCK_OVERVIEW_DATA.metrics.totalPosts * multiplier),
      }
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
   * Fetch network graph (nodes, edges, communities)
   */
  async getNetwork(): Promise<{
    nodes: NetworkNode[];
    edges: NetworkEdge[];
    communities: NetworkCommunity[];
  }> {
    await new Promise((r) => setTimeout(r, 60));
    return {
      nodes: MOCK_NETWORK_NODES,
      edges: MOCK_NETWORK_EDGES,
      communities: MOCK_COMMUNITIES
    };
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
