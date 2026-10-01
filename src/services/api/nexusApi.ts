import {
  AudienceAggregate,
  EmergingNarrative,
  EmotionItem,
  GetNetworkParams,
  GetSentimentParams,
  GetTimelineParams,
  GetTrendsParams,
  NetworkCommunity,
  NetworkDatasetResult,
  NetworkEdge,
  NetworkNode,
  NetworkResponse,
  OverviewData,
  Platform,
  PlatformSentimentComparison,
  SentimentComposition,
  SentimentDataPoint,
  SentimentResponse,
  SentimentType,
  TimeFilter,
  TimelineEvent,
  TimelineResponse,
  TrendItem
} from '../../types/nexus';
import { MOCK_OVERVIEW_DATA } from '../../data/mock/overviewData';
import { MOCK_TIMELINE_EVENTS } from '../../data/mock/timelineData';

export type { SentimentComposition };
export type { GetNetworkParams };

// Centralized API abstraction layer for NEXUS
const API_BASE_URL = (
  (typeof import.meta !== 'undefined' && import.meta.env
    ? (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '')
    : '')
).replace(/\/$/, '');

export const nexusApi = {
  /**
   * Fetch complete overview brief filtered by timeRange and platform from real backend API
   */
  async getOverview(timeRange: TimeFilter = '24h', platform: Platform = 'all'): Promise<OverviewData> {
    const params = new URLSearchParams({
      timeRange,
      timeFilter: timeRange,
      platform,
    });

    const url = `${API_BASE_URL}/api/overview?${params.toString()}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch overview: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data as OverviewData;
  },

  /**
   * Fetch complete sentiment intelligence payload from real backend /api/sentiment
   */
  async getSentiment(
    timeRangeOrParams: TimeFilter | GetSentimentParams = '24h',
    platform: Platform = 'all'
  ): Promise<SentimentResponse> {
    const searchParams = new URLSearchParams();

    if (typeof timeRangeOrParams === 'object' && timeRangeOrParams !== null) {
      const p = timeRangeOrParams;
      const tf = p.timeFilter || p.timeRange || '24h';
      searchParams.set('timeRange', tf);
      searchParams.set('timeFilter', tf);
      if (p.platform && p.platform !== 'all') {
        searchParams.set('platform', p.platform);
      }
      if (p.daysBack !== undefined) {
        searchParams.set('daysBack', String(p.daysBack));
      }
    } else {
      searchParams.set('timeRange', timeRangeOrParams);
      searchParams.set('timeFilter', timeRangeOrParams);
      if (platform !== 'all') {
        searchParams.set('platform', platform);
      }
    }

    const url = `${API_BASE_URL}/api/sentiment?${searchParams.toString()}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch sentiment intelligence: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data as SentimentResponse;
  },

  /**
   * Fetch current sentiment composition for donut visualization aligned to platform and timeRange
   */
  async getSentimentComposition(
    timeRange: TimeFilter = '24h',
    platform: Platform = 'all'
  ): Promise<SentimentComposition> {
    const full = await this.getSentiment(timeRange, platform);
    return full.composition;
  },

  /**
   * Fetch chronological timeline events with filtering and pagination from real backend
   */
  async getTimeline(params?: GetTimelineParams): Promise<TimelineResponse> {
    const searchParams = new URLSearchParams();

    if (params?.platform && params.platform !== 'all') {
      searchParams.set('platform', params.platform);
    }
    if (params?.sentiment && params.sentiment !== 'all') {
      searchParams.set('sentiment', params.sentiment);
    }
    if (params?.topicId && params.topicId !== 'all') {
      searchParams.set('topicId', params.topicId);
    }
    if (params?.searchQuery && params.searchQuery.trim()) {
      searchParams.set('searchQuery', params.searchQuery.trim());
    } else if (params?.search && params.search.trim()) {
      searchParams.set('searchQuery', params.search.trim());
    } else if (params?.q && params.q.trim()) {
      searchParams.set('searchQuery', params.q.trim());
    }
    if (params?.timeFilter) {
      searchParams.set('timeFilter', params.timeFilter);
    } else if (params?.timeRange) {
      searchParams.set('timeRange', params.timeRange);
    }
    if (params?.daysBack) {
      searchParams.set('daysBack', String(params.daysBack));
    }
    if (typeof params?.limit === 'number') {
      searchParams.set('limit', String(params.limit));
    }
    if (typeof params?.offset === 'number') {
      searchParams.set('offset', String(params.offset));
    }

    const url = `${API_BASE_URL}/api/timeline?${searchParams.toString()}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch timeline dispatches: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (Array.isArray(data)) {
      return {
        items: data,
        total: data.length,
        limit: params?.limit || data.length,
        offset: params?.offset || 0,
      };
    }

    return data as TimelineResponse;
  },

  /**
   * Fetch sentiment over time series aligned to active time horizon and platform
   */
  async getSentimentTrends(
    timeRange: TimeFilter = '24h',
    platform: Platform = 'all'
  ): Promise<SentimentDataPoint[]> {
    const full = await this.getSentiment(timeRange, platform);
    return full.trends;
  },

  /**
   * Fetch emotion breakdown filtered by platform and timeRange
   */
  async getEmotionDistribution(
    platform: Platform = 'all',
    timeRange: TimeFilter = '24h'
  ): Promise<EmotionItem[]> {
    const full = await this.getSentiment(timeRange, platform);
    return full.emotions;
  },

  /**
   * Fetch platform sentiment comparison.
   */
  async getPlatformSentiment(
    platform: Platform = 'all',
    timeRange: TimeFilter = '24h'
  ): Promise<PlatformSentimentComparison[]> {
    const full = await this.getSentiment(timeRange, platform);
    return full.platformComparison;
  },

  /**
   * Fetch real trend landscape scatter and ranked items filtered by timeRange and platform from real backend /api/trends
   */
  async getTrends(
    timeRangeOrParams: TimeFilter | GetTrendsParams = '24h',
    platform: Platform = 'all'
  ): Promise<TrendItem[]> {
    const searchParams = new URLSearchParams();

    if (typeof timeRangeOrParams === 'object' && timeRangeOrParams !== null) {
      const p = timeRangeOrParams;
      const tf = p.timeFilter || p.timeRange || '24h';
      searchParams.set('timeRange', tf);
      searchParams.set('timeFilter', tf);
      if (p.platform && p.platform !== 'all') {
        searchParams.set('platform', p.platform);
      }
      if (p.daysBack !== undefined) {
        searchParams.set('daysBack', String(p.daysBack));
      }
    } else {
      searchParams.set('timeRange', timeRangeOrParams);
      searchParams.set('timeFilter', timeRangeOrParams);
      if (platform !== 'all') {
        searchParams.set('platform', platform);
      }
    }

    const url = `${API_BASE_URL}/api/trends?${searchParams.toString()}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch trends: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (Array.isArray(data)) {
      return data as TrendItem[];
    }
    if (data && Array.isArray(data.items)) {
      return data.items as TrendItem[];
    }
    return [];
  },

  /**
   * Fetch network graph (nodes, edges, communities, summary) filtered by time horizon and platform from real backend /api/network
   */
  async getNetwork(params?: GetNetworkParams | number): Promise<NetworkResponse> {
    const searchParams = new URLSearchParams();

    if (typeof params === 'number') {
      searchParams.set('daysBack', String(params));
    } else if (params) {
      if (params.timeFilter) {
        searchParams.set('timeFilter', params.timeFilter);
        searchParams.set('timeRange', params.timeFilter);
      } else if (params.timeRange) {
        searchParams.set('timeRange', params.timeRange);
        searchParams.set('timeFilter', params.timeRange);
      }
      if (params.platform && params.platform !== 'all') {
        searchParams.set('platform', params.platform);
      } else if (params.platformFilter && params.platformFilter !== 'all') {
        searchParams.set('platform', params.platformFilter);
      }
      if (params.daysBack !== undefined) {
        searchParams.set('daysBack', String(params.daysBack));
      }
    }

    const url = `${API_BASE_URL}/api/network?${searchParams.toString()}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch network graph: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data as NetworkResponse;
  },

  /**
   * Fetch single narrative details
   */
  async getNarrativeDetail(id: string): Promise<EmergingNarrative | null> {
    try {
      const overview = await this.getOverview('30d', 'all');
      const found = overview.narratives?.find(
        (n) => n.id === id || n.name.toLowerCase() === id.toLowerCase() || id.toLowerCase().includes(n.id.toLowerCase())
      );
      if (found) return found;
    } catch {
      // fallback
    }
    const foundFallback = MOCK_OVERVIEW_DATA.narratives.find((n) => n.id === id);
    return foundFallback || null;
  },

  /**
   * Fetch single node details from live network graph
   */
  async getNodeDetail(id: string): Promise<NetworkNode | null> {
    try {
      const net = await this.getNetwork({ timeFilter: '30d' });
      const found = net.nodes?.find(
        (n) => n.id === id || n.label.toLowerCase() === id.toLowerCase() || n.alias.toLowerCase() === id.toLowerCase()
      );
      if (found) return found;
    } catch {
      // fallback
    }
    return null;
  }
};
