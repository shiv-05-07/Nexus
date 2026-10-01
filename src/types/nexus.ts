export type ScreenId = 'overview' | 'timeline' | 'sentiment' | 'trends' | 'network';

export type TimeFilter = '10m' | '1h' | '6h' | '24h' | '7d' | '30d';

export type Platform = 'all' | 'x' | 'telegram' | 'reddit' | 'youtube';

export type SentimentType = 'positive' | 'neutral' | 'negative';

export type EmotionType = 'anxiety' | 'excitement' | 'supportive' | 'opposition' | 'sarcasm';

export interface EmergingNarrative {
  id: string;
  name: string;
  summary: string;
  growthPct: number;
  mentionCount: number;
  sentiment: SentimentType;
  dominantEmotion: EmotionType;
  platforms: ('x' | 'telegram' | 'reddit' | 'youtube')[];
  sparkline: number[];
  accelerationScore: number;
  firstObserved: string;
  lastObserved: string;
  communityIds: string[];
  keyQuotes: {
    author: string;
    platform: 'x' | 'telegram' | 'reddit' | 'youtube';
    text: string;
    timestamp: string;
  }[];
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  timeFormatted: string;
  platform: 'x' | 'telegram' | 'reddit' | 'youtube';
  topicId: string;
  topicName: string;
  authorHandle: string;
  authorAlias?: string;
  content: string;
  sentiment: SentimentType;
  emotion: EmotionType;
  engagement: {
    likes: number;
    reposts: number;
    comments: number;
    views?: number;
  };
  reachScore: number;
  verified?: boolean;
}

export interface TimelineResponse {
  items: TimelineEvent[];
  total: number;
  limit: number;
  offset: number;
}

export interface GetTimelineParams {
  platform?: Platform;
  sentiment?: string;
  topicId?: string;
  searchQuery?: string;
  search?: string;
  q?: string;
  timeFilter?: TimeFilter;
  timeRange?: TimeFilter;
  daysBack?: number | string;
  limit?: number;
  offset?: number;
}

export interface SentimentComposition {
  positive: number;
  neutral: number;
  negative: number;
  totalAnalyzed: number;
  dominantSentiment: SentimentType;
  description: string;
}

export interface SentimentDataPoint {
  timestamp: string;
  timeLabel: string;
  positive: number;
  neutral: number;
  negative: number;
  volume: number;
}

export interface EmotionItem {
  emotion: EmotionType;
  label: string;
  percentage: number;
  volume: number;
  trendDelta: string;
  description: string;
}

export interface PlatformSentimentComparison {
  platform: 'x' | 'telegram' | 'reddit' | 'youtube';
  platformName: string;
  positivePct: number;
  neutralPct: number;
  negativePct: number;
  totalVolume: number;
}

export interface SentimentResponse {
  composition: SentimentComposition;
  trends: SentimentDataPoint[];
  emotions: EmotionItem[];
  platformComparison: PlatformSentimentComparison[];
}

export interface GetSentimentParams {
  timeRange?: TimeFilter;
  timeFilter?: TimeFilter;
  daysBack?: number | string;
  platform?: Platform;
}

export interface GetTrendsParams {
  timeRange?: TimeFilter;
  timeFilter?: TimeFilter;
  daysBack?: number | string;
  platform?: Platform;
}

export interface TrendItem {
  id: string;
  name: string;
  volume: number;
  accelerationPct: number;
  sentiment: SentimentType;
  dominantEmotion: EmotionType;
  platforms: ('x' | 'telegram' | 'reddit' | 'youtube')[];
  communityName: string;
  sparkline: number[];
  isAccelerating: boolean;
  x: number; // Volume coordinate for scatter plot
  y: number; // Acceleration coordinate for scatter plot
  radius: number;
}

export interface NetworkNode {
  id: string;
  label: string;
  alias: string;
  communityId: string;
  communityName: string;
  role: string;
  platform: Platform;
  platforms?: Platform[];
  pagerank: number;
  betweenness: number;
  connectionsCount: number;
  isBridge: boolean;
  x: number;
  y: number;
  recentTopics: string[];
  activityVolume: number;
  avatarColor: string;
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  weight: number;
  interactionType: 'reply' | 'repost' | 'mention' | 'quote';
  platform?: Platform;
}

export interface NetworkCommunity {
  id: string;
  name: string;
  color: string;
  nodeCount: number;
  dominantSentiment: SentimentType;
  description: string;
}

export interface NetworkSummary {
  activeCommunities: number;
  monitoredNodes: number;
  interactionLinks: number;
  bridgeNodes: number;
}

export interface NetworkResponse {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  communities: NetworkCommunity[];
  summary: NetworkSummary;
}

export type NetworkDatasetResult = NetworkResponse;

export interface GetNetworkParams {
  timeRange?: TimeFilter;
  timeFilter?: TimeFilter;
  daysBack?: number | string;
  platform?: Platform;
  platformFilter?: Platform;
}

export interface AudienceAggregate {
  ageGroups: { range: string; percentage: number }[];
  languages: { language: string; percentage: number }[];
  regions: { region: string; percentage: number }[];
  methodologyNote: string;
}

export interface OverviewData {
  metrics: {
    totalPosts: number;
    activeTopicsCount: number;
    emergingGrowthPct: number;
    negativeSentimentPct: number;
    lastUpdatedSecondsAgo: number;
  };
  narratives: EmergingNarrative[];
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  audience: AudienceAggregate;
  networkSummary: {
    activeCommunities: number;
    bridgeNodesCount: number;
    monitoredNodes: number;
  };
}

export type DetailDrawerState = 
  | { type: 'narrative'; data: EmergingNarrative }
  | { type: 'node'; data: NetworkNode }
  | { type: 'event'; data: TimelineEvent }
  | null;

export type UserRole = 'lead_analyst' | 'analyst' | 'viewer';

export interface UserRolePermissions {
  canConfirmSignal: boolean;
  canVerifyRecord: boolean;
  canExportData: boolean;
  canViewIntelligence: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  roleLabel: string;
  callsign: string;
  clearance: string;
  avatarInitials: string;
  permissions: UserRolePermissions;
}

export interface ConfirmSignalResult {
  success: boolean;
  signalId: string;
  status: 'confirmed';
  confirmedAt: string;
  confirmedBy: string;
}

export interface VerifyRecordResult {
  success: boolean;
  recordId: string;
  status: 'verified';
  updatedRecord?: boolean;
  verifiedAt: string;
  verifiedBy: string;
}
