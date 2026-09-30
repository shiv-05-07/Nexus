export type ScreenId = 
  | 'overview'
  | 'timeline'
  | 'sentiment'
  | 'trends'
  | 'audience'
  | 'network'
  | 'investigate'
  | 'coordination'
  | 'integrity';

export type DataMode = 'LIVE' | 'ARCHIVE' | 'SYNTHETIC';

export type TimeRange = '10m' | '1h' | '6h' | '24h' | '7d';

export type Platform = 'ALL' | 'X' | 'TELEGRAM' | 'YOUTUBE' | 'REDDIT';

export type ReviewState = 'UNREVIEWED' | 'CONFIRMED' | 'DISMISSED';

export interface TimelineEvent {
  id: string;
  timestamp: string; // ISO or HH:MM:SS
  timeAgo: string;
  platform: 'X' | 'TELEGRAM' | 'YOUTUBE' | 'REDDIT';
  title: string;
  description: string;
  topicId?: string;
  topicName?: string;
  eventCount: number;
  sentimentDelta?: string;
  community?: string;
  nodeId?: string;
  urgency: 'high' | 'medium' | 'low';
}

export interface IntelligenceMetric {
  key: string;
  label: string;
  value: number;
  format: 'number' | 'percentage' | 'delta';
  delta: string;
  isPositiveDelta: boolean;
  timestamp: string;
}

export interface EmergingNarrative {
  id: string;
  rank: string;
  topic: string;
  trendScore: number;
  acceleration: string; // e.g. "+312%"
  volume: string; // e.g. "4.2K / 2h"
  mentionCount: number;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  platforms: ('X' | 'TELEGRAM' | 'YOUTUBE' | 'REDDIT')[];
  communitiesCount: number;
  primaryCommunity: string;
  keyBridgeNode: string;
  summary: string;
  status: 'EMERGING' | 'STABLE' | 'DECLINING';
}

export interface IntelligenceAlert {
  id: string;
  time: string;
  title: string;
  detail: string;
  type: 'EMERGING' | 'CROSS_PLATFORM' | 'BRIDGE_NODE' | 'COORDINATION';
  topicId?: string;
  read: boolean;
}

export interface SentimentDataPoint {
  time: string;
  positive: number;
  neutral: number;
  negative: number;
  sarcasmLikelihood: number;
}

export interface EmotionBreakdown {
  supportive: number;
  opposition: number;
  anxiety: number;
  anger: number;
  excitement: number;
  sarcasm: number;
}

export interface NetworkNode {
  id: string;
  label: string;
  communityId: string;
  communityName: string;
  betweenness: number;
  pageRank: number;
  observedActivity: number;
  platform: 'X' | 'TELEGRAM' | 'YOUTUBE' | 'REDDIT';
  x: number;
  y: number;
  isBridge?: boolean;
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  type: 'reply' | 'repost' | 'mention' | 'quote' | 'forward';
  weight: number;
}

export interface PropagationStep {
  stepIndex: number;
  time: string;
  title: string;
  entity: string;
  type: 'OBSERVED' | 'COMMUNITY' | 'BRIDGE_NODE' | 'PLATFORM';
  detail: string;
  platform?: string;
  nodeId?: string;
  communityId?: string;
  active: boolean;
}

export interface AudienceCluster {
  id: string;
  name: string;
  ageBracket: string; // e.g. "18–24 (63%)"
  languages: string; // e.g. "Hindi / English (71%)"
  region: string; // e.g. "Western India (58%)"
  interests: string; // e.g. "Technology (46%)"
  sampleSize: string; // e.g. "3,842"
  confidence: number; // e.g. 0.74
  coverage: number; // e.g. 0.68
  isUnknown?: boolean;
}

export interface CoordinationCluster {
  id: string;
  name: string;
  membersCount: number;
  sharedItemsCount: number;
  medianTimingGapSec: number;
  similarityScore: number;
  synchronyScore: number;
  pValue: number;
  fdrAdjusted: boolean;
  reviewState: ReviewState;
  nodeIds: string[];
  summary: string;
}

export interface EvidenceRecord {
  id: string; // e.g. "NX-2026-0917"
  timestamp: string;
  source: string;
  model: string;
  confidence: number;
  previousHash: string;
  recordHash: string;
  signatureStatus: 'VERIFIED' | 'PENDING' | 'INVALID';
  chainStatus: 'VALID' | 'TAMPERED';
  merkleCheckpoint: string;
  payloadSummary: string;
}
