import {
  AudienceCluster,
  CoordinationCluster,
  EmergingNarrative,
  EvidenceRecord,
  IntelligenceAlert,
  IntelligenceMetric,
  NetworkEdge,
  NetworkNode,
  NexusDataset,
  PropagationStep,
  SentimentDataPoint,
  TimelineEvent,
} from '../types/nexus';

// =========================================================
// 1. SYNTHETIC DATASET (Primary Demonstration Universe)
// Narrative: PUBLIC TRANSPORT STRIKE (TP-8842)
// =========================================================

export const SYNTHETIC_METRICS: IntelligenceMetric[] = [
  {
    key: 'events',
    label: 'EVENTS',
    value: 284391,
    format: 'number',
    delta: '+4,812 in 2h',
    isPositiveDelta: true,
    timestamp: '14 SEC AGO',
  },
  {
    key: 'actors',
    label: 'OBSERVED ACTORS',
    value: 42891,
    format: 'number',
    delta: '+318 new',
    isPositiveDelta: true,
    timestamp: '14 SEC AGO',
  },
  {
    key: 'topics',
    label: 'ACTIVE TOPICS',
    value: 137,
    format: 'number',
    delta: '+3 emerging',
    isPositiveDelta: true,
    timestamp: '14 SEC AGO',
  },
  {
    key: 'alerts',
    label: 'INTELLIGENCE ALERTS',
    value: 12,
    format: 'number',
    delta: '2 critical',
    isPositiveDelta: false,
    timestamp: '14 SEC AGO',
  },
  {
    key: 'velocity',
    label: 'NARRATIVE VELOCITY',
    value: 18.4,
    format: 'percentage',
    delta: '+4.2% vs 24h avg',
    isPositiveDelta: true,
    timestamp: '14 SEC AGO',
  },
];

export const SYNTHETIC_NARRATIVES: EmergingNarrative[] = [
  {
    id: 'TP-8842',
    rank: '01',
    topic: 'PUBLIC TRANSPORT STRIKE',
    trendScore: 87,
    acceleration: '+312%',
    volume: '4.2K mentions / 2h',
    mentionCount: 4283,
    sentiment: { positive: 12, neutral: 20, negative: 68 },
    platforms: ['X', 'TELEGRAM', 'YOUTUBE', 'REDDIT'],
    communitiesCount: 7,
    primaryCommunity: 'Community 04',
    keyBridgeNode: 'N184',
    summary: 'Synchronized discourse around transit fare hikes rapidly escalated into strike mobilization calls crossing from X to private Telegram channels.',
    status: 'EMERGING',
  },
  {
    id: 'TP-8843',
    rank: '02',
    topic: 'URBAN WATER SUPPLY',
    trendScore: 74,
    acceleration: '+184%',
    volume: '2.1K mentions / 2h',
    mentionCount: 2140,
    sentiment: { positive: 18, neutral: 34, negative: 48 },
    platforms: ['X', 'REDDIT'],
    communitiesCount: 4,
    primaryCommunity: 'Community 02',
    keyBridgeNode: 'N092',
    summary: 'Localized municipal infrastructure failure reports gaining regional momentum with high citizen reaction volume.',
    status: 'EMERGING',
  },
  {
    id: 'TP-8844',
    rank: '03',
    topic: 'CAMPUS NETWORK OUTAGE',
    trendScore: 69,
    acceleration: '+96%',
    volume: '1.4K mentions / 2h',
    mentionCount: 1420,
    sentiment: { positive: 8, neutral: 40, negative: 52 },
    platforms: ['X', 'TELEGRAM'],
    communitiesCount: 3,
    primaryCommunity: 'Community 05',
    keyBridgeNode: 'N118',
    summary: 'University infrastructure downtime discussion with concentrated student sentiment and rumor propagation.',
    status: 'EMERGING',
  },
  {
    id: 'TP-8845',
    rank: '04',
    topic: 'DIGITAL CURRENCY PILOT',
    trendScore: 58,
    acceleration: '+42%',
    volume: '980 mentions / 2h',
    mentionCount: 980,
    sentiment: { positive: 42, neutral: 38, negative: 20 },
    platforms: ['X', 'YOUTUBE', 'REDDIT'],
    communitiesCount: 5,
    primaryCommunity: 'Community 01',
    keyBridgeNode: 'N045',
    summary: 'Fintech discussion focused on official pilot release notes and policy debate.',
    status: 'STABLE',
  },
];

export const SYNTHETIC_ALERTS: IntelligenceAlert[] = [
  {
    id: 'ALT-1042',
    time: '10:42 UTC',
    title: 'EMERGING NARRATIVE',
    detail: 'Acceleration threshold crossed (+312%) on "Public Transport Strike"',
    type: 'EMERGING',
    topicId: 'TP-8842',
    read: false,
  },
  {
    id: 'ALT-1031',
    time: '10:31 UTC',
    title: 'CROSS-PLATFORM SIGNAL',
    detail: 'Topic crossover detected on X + Telegram via bridge node N184',
    type: 'CROSS_PLATFORM',
    topicId: 'TP-8842',
    read: false,
  },
  {
    id: 'ALT-1018',
    time: '10:18 UTC',
    title: 'COMMUNITY BRIDGE',
    detail: 'High-betweenness node N184 (0.81) activated in Community 04',
    type: 'BRIDGE_NODE',
    topicId: 'TP-8842',
    read: false,
  },
  {
    id: 'ALT-1004',
    time: '10:04 UTC',
    title: 'COORDINATION SIGNAL',
    detail: 'Statistical association detected (p = 0.003, median gap 42s)',
    type: 'COORDINATION',
    topicId: 'TP-8842',
    read: false,
  },
];

export const SYNTHETIC_TIMELINE: TimelineEvent[] = [
  {
    id: 'EV-114208',
    timestamp: '11:42:08 UTC',
    timeAgo: '1 min ago',
    minutesAgo: 1,
    platform: 'X',
    title: 'Topic Cluster Expansion',
    description: 'Public Transport Strike cluster expanded across 14 new sub-threads (+184 events). High engagement velocity.',
    topicId: 'TP-8842',
    topicName: 'PUBLIC TRANSPORT STRIKE',
    eventCount: 184,
    sentimentDelta: '-4.2% Negative Shift',
    community: 'Community 04',
    nodeId: 'N184',
    urgency: 'high',
  },
  {
    id: 'EV-114136',
    timestamp: '11:41:36 UTC',
    timeAgo: '2 mins ago',
    minutesAgo: 2,
    platform: 'TELEGRAM',
    title: 'Narrative Crossover Detected',
    description: 'Broadcast channel @transit_updates forwarded strike infographic from Community 04 into 3 regional groups.',
    topicId: 'TP-8842',
    topicName: 'PUBLIC TRANSPORT STRIKE',
    eventCount: 62,
    sentimentDelta: '-8.1% Negative Shift',
    community: 'Community 07',
    nodeId: 'N209',
    urgency: 'high',
  },
  {
    id: 'EV-114012',
    timestamp: '11:40:12 UTC',
    timeAgo: '3 mins ago',
    minutesAgo: 3,
    platform: 'X',
    title: 'Negative Sentiment Surge',
    description: 'Hashtag #TransitShutdown peaked at 1.8K posts/hr. Sarcasm detection confidence 0.82.',
    topicId: 'TP-8842',
    topicName: 'PUBLIC TRANSPORT STRIKE',
    eventCount: 310,
    sentimentDelta: '+11.4% Negative',
    community: 'Community 04',
    nodeId: 'N184',
    urgency: 'medium',
  },
  {
    id: 'EV-113709',
    timestamp: '11:37:09 UTC',
    timeAgo: '6 mins ago',
    minutesAgo: 6,
    platform: 'YOUTUBE',
    title: 'Related Video Discussion Cluster',
    description: 'Live commentary stream titled "Bus Union Presser Live" published, generating 480 comments in 12 minutes.',
    topicId: 'TP-8842',
    topicName: 'PUBLIC TRANSPORT STRIKE',
    eventCount: 480,
    sentimentDelta: 'Neutral / Mixed',
    community: 'Community 01',
    nodeId: 'N045',
    urgency: 'medium',
  },
  {
    id: 'EV-113115',
    timestamp: '11:31:15 UTC',
    timeAgo: '12 mins ago',
    minutesAgo: 12,
    platform: 'REDDIT',
    title: 'Subreddit Megathread Created',
    description: 'r/citypulse megathread created with 142 replies discussing fare hike timeline.',
    topicId: 'TP-8842',
    topicName: 'PUBLIC TRANSPORT STRIKE',
    eventCount: 142,
    sentimentDelta: 'Negative 64%',
    community: 'Community 02',
    nodeId: 'N092',
    urgency: 'low',
  },
  {
    id: 'EV-112450',
    timestamp: '11:24:50 UTC',
    timeAgo: '18 mins ago',
    minutesAgo: 18,
    platform: 'X',
    title: 'Bridge Account Retweet Wave',
    description: 'Account N184 re-posted quote card with high amplification index across regional accounts.',
    topicId: 'TP-8842',
    topicName: 'PUBLIC TRANSPORT STRIKE',
    eventCount: 215,
    sentimentDelta: '-2.8%',
    community: 'Community 04',
    nodeId: 'N184',
    urgency: 'high',
  },
  {
    id: 'EV-111500',
    timestamp: '11:15:00 UTC',
    timeAgo: '28 mins ago',
    minutesAgo: 28,
    platform: 'TELEGRAM',
    title: 'Coordination Spike Observed',
    description: 'Group chat payload sync detected across 7 accounts (Cluster CORD-04). Median gap 42 seconds.',
    topicId: 'TP-8842',
    topicName: 'PUBLIC TRANSPORT STRIKE',
    eventCount: 95,
    sentimentDelta: '+6.2% Negative',
    community: 'Community 07',
    nodeId: 'N209',
    urgency: 'high',
  },
  {
    id: 'EV-110200',
    timestamp: '11:02:00 UTC',
    timeAgo: '40 mins ago',
    minutesAgo: 40,
    platform: 'YOUTUBE',
    title: 'Shorts Clip Amplification',
    description: '3 short-form videos analyzing fare subsidy revisions gained 12K views in 30 minutes.',
    topicId: 'TP-8842',
    topicName: 'PUBLIC TRANSPORT STRIKE',
    eventCount: 320,
    sentimentDelta: 'Mixed / Neutral',
    community: 'Community 01',
    nodeId: 'N045',
    urgency: 'medium',
  },
  {
    id: 'EV-105000',
    timestamp: '10:50:00 UTC',
    timeAgo: '52 mins ago',
    minutesAgo: 52,
    platform: 'REDDIT',
    title: 'Regional Commuter Discussion Thread',
    description: 'r/transit_talk thread created comparing regional bus fare statistics.',
    topicId: 'TP-8842',
    topicName: 'PUBLIC TRANSPORT STRIKE',
    eventCount: 88,
    sentimentDelta: 'Negative 52%',
    community: 'Community 02',
    nodeId: 'N092',
    urgency: 'low',
  },
  {
    id: 'EV-094500',
    timestamp: '09:45:00 UTC',
    timeAgo: '2h ago',
    minutesAgo: 118,
    platform: 'X',
    title: 'Hashtag Trend Emergence',
    description: '#TransitFareHike entered top 10 regional trends on X with rapid retweet momentum.',
    topicId: 'TP-8842',
    topicName: 'PUBLIC TRANSPORT STRIKE',
    eventCount: 420,
    sentimentDelta: '+14.2% Negative',
    community: 'Community 04',
    nodeId: 'N184',
    urgency: 'high',
  },
  {
    id: 'EV-083000',
    timestamp: '08:30:00 UTC',
    timeAgo: '3h ago',
    minutesAgo: 193,
    platform: 'TELEGRAM',
    title: 'Channel Subscriber Forward Surge',
    description: 'Strike call digital poster forwarded across 8 public channels reaching ~45K subscribers.',
    topicId: 'TP-8842',
    topicName: 'PUBLIC TRANSPORT STRIKE',
    eventCount: 180,
    sentimentDelta: 'Negative 70%',
    community: 'Community 07',
    nodeId: 'N209',
    urgency: 'medium',
  },
  {
    id: 'EV-071500',
    timestamp: '07:15:00 UTC',
    timeAgo: '4h ago',
    minutesAgo: 268,
    platform: 'YOUTUBE',
    title: 'News Channel Panel Live Broadcast',
    description: 'Local news channel streamed live debate with transport union representatives.',
    topicId: 'TP-8842',
    topicName: 'PUBLIC TRANSPORT STRIKE',
    eventCount: 650,
    sentimentDelta: 'Neutral 48%',
    community: 'Community 01',
    nodeId: 'N045',
    urgency: 'medium',
  },
  {
    id: 'EV-060000',
    timestamp: '06:00:00 UTC',
    timeAgo: '5h ago',
    minutesAgo: 343,
    platform: 'REDDIT',
    title: 'Subreddit AMA Announcement Thread',
    description: 'Union representative post pinned in regional subreddit with 210 comments.',
    topicId: 'TP-8842',
    topicName: 'PUBLIC TRANSPORT STRIKE',
    eventCount: 210,
    sentimentDelta: 'Negative 58%',
    community: 'Community 02',
    nodeId: 'N092',
    urgency: 'low',
  },
  {
    id: 'EV-040000',
    timestamp: '04:00:00 UTC',
    timeAgo: '7h ago',
    minutesAgo: 463,
    platform: 'TELEGRAM',
    title: 'Early Coordination Payload Leak',
    description: 'Meeting minutes summary pasted into private channel ahead of public statement.',
    topicId: 'TP-8842',
    topicName: 'PUBLIC TRANSPORT STRIKE',
    eventCount: 110,
    sentimentDelta: 'Neutral / Confidential',
    community: 'Community 07',
    nodeId: 'N209',
    urgency: 'high',
  },
];

export const SYNTHETIC_SENTIMENT_SERIES: SentimentDataPoint[] = [
  { time: '06:00', positive: 24, neutral: 58, negative: 18, sarcasmLikelihood: 0.12 },
  { time: '07:00', positive: 22, neutral: 54, negative: 24, sarcasmLikelihood: 0.18 },
  { time: '08:00', positive: 20, neutral: 48, negative: 32, sarcasmLikelihood: 0.35 },
  { time: '09:00', positive: 16, neutral: 38, negative: 46, sarcasmLikelihood: 0.54 },
  { time: '10:00', positive: 14, neutral: 28, negative: 58, sarcasmLikelihood: 0.76 },
  { time: '11:00', positive: 12, neutral: 20, negative: 68, sarcasmLikelihood: 0.82 },
];

export const SYNTHETIC_EMOTION_BREAKDOWN = {
  supportive: 12,
  opposition: 38,
  anxiety: 24,
  anger: 18,
  excitement: 4,
  sarcasm: 14,
};

export const SYNTHETIC_NETWORK_NODES: NetworkNode[] = [
  { id: 'N184', label: 'Bridge Account N184', communityId: 'C04', communityName: 'Community 04 (Transit Focus)', betweenness: 0.81, pageRank: 0.64, observedActivity: 184, platform: 'X', x: 280, y: 190, isBridge: true },
  { id: 'N185', label: 'Node N185', communityId: 'C04', communityName: 'Community 04 (Transit Focus)', betweenness: 0.42, pageRank: 0.38, observedActivity: 92, platform: 'X', x: 220, y: 150 },
  { id: 'N186', label: 'Node N186', communityId: 'C04', communityName: 'Community 04 (Transit Focus)', betweenness: 0.35, pageRank: 0.31, observedActivity: 74, platform: 'X', x: 340, y: 140 },
  { id: 'N209', label: 'Bridge Channel N209', communityId: 'C07', communityName: 'Community 07 (Regional Chat)', betweenness: 0.76, pageRank: 0.58, observedActivity: 142, platform: 'TELEGRAM', x: 520, y: 220, isBridge: true },
  { id: 'N210', label: 'Node N210', communityId: 'C07', communityName: 'Community 07 (Regional Chat)', betweenness: 0.39, pageRank: 0.34, observedActivity: 88, platform: 'TELEGRAM', x: 580, y: 160 },
  { id: 'N045', label: 'Media Outlet N045', communityId: 'C01', communityName: 'Community 01 (Broadcasting)', betweenness: 0.55, pageRank: 0.49, observedActivity: 110, platform: 'YOUTUBE', x: 180, y: 380 },
  { id: 'N092', label: 'Forum Host N092', communityId: 'C02', communityName: 'Community 02 (Discussion)', betweenness: 0.48, pageRank: 0.41, observedActivity: 95, platform: 'REDDIT', x: 420, y: 410 },
];

export const SYNTHETIC_NETWORK_EDGES: NetworkEdge[] = [
  { id: 'E1', source: 'N184', target: 'N185', type: 'repost', weight: 4.5 },
  { id: 'E2', source: 'N184', target: 'N186', type: 'mention', weight: 3.8 },
  { id: 'E6', source: 'N184', target: 'N209', type: 'forward', weight: 8.2 },
  { id: 'E7', source: 'N209', target: 'N210', type: 'forward', weight: 5.1 },
  { id: 'E10', source: 'N184', target: 'N045', type: 'mention', weight: 3.4 },
  { id: 'E13', source: 'N209', target: 'N092', type: 'quote', weight: 3.1 },
];

export const SYNTHETIC_PROPAGATION: PropagationStep[] = [
  { stepIndex: 1, time: '10:02 UTC', title: 'TOPIC FIRST OBSERVED', entity: 'Initial fare hike rumor posted in small mobility group', type: 'OBSERVED', detail: 'First single-source posting detected. Low volume baseline.', platform: 'X', active: true },
  { stepIndex: 2, time: '10:14 UTC', title: 'COMMUNITY 04 ACTIVATION', entity: 'Community 04 (Transit Focus)', type: 'COMMUNITY', communityId: 'C04', detail: 'Dense internal re-posting across 14 connected accounts in C04.', platform: 'X', active: true },
  { stepIndex: 3, time: '10:18 UTC', title: 'BRIDGE NODE ACTIVATION', entity: 'Bridge Node N184 (Betweenness 0.81)', type: 'BRIDGE_NODE', nodeId: 'N184', detail: 'Account N184 authored quote-tweet amplifying strike call graphics.', platform: 'X', active: true },
  { stepIndex: 4, time: '10:28 UTC', title: 'CROSSOVER TO COMMUNITY 07', entity: 'Community 07 (Regional Telegram Chat)', type: 'COMMUNITY', communityId: 'C07', detail: 'Direct forward from X quote card into private Telegram channels.', platform: 'TELEGRAM', active: true },
  { stepIndex: 5, time: '10:31 UTC', title: 'PLATFORM SPREAD: TELEGRAM', entity: 'Broadcast Channel @transit_updates', type: 'PLATFORM', detail: 'Subscribed subscriber base of 12K notified. Acceleration surge.', platform: 'TELEGRAM', active: true },
];

export const SYNTHETIC_AUDIENCE: AudienceCluster[] = [
  { id: 'CL-07', name: 'CLUSTER 07', ageBracket: '18–24 (63%)', languages: 'Hindi / English (71%)', region: 'Western India (58%)', interests: 'Technology (46%)', sampleSize: '3,842', confidence: 0.74, coverage: 0.68 },
  { id: 'CL-04', name: 'CLUSTER 04', ageBracket: '25–34 (54%)', languages: 'English / Marathi (68%)', region: 'Metropolitan Urban (72%)', interests: 'Civic Infrastructure (62%)', sampleSize: '2,190', confidence: 0.81, coverage: 0.52 },
  { id: 'CL-UNKNOWN', name: 'UNKNOWN / INSUFFICIENT EVIDENCE', ageBracket: 'Unassigned', languages: 'Mixed Public Signals', region: 'VPN / Privacy Shielded', interests: 'Broad Multi-Topic', sampleSize: '1,280', confidence: 0.21, coverage: 0.18, isUnknown: true },
];

export const SYNTHETIC_COORDINATION: CoordinationCluster[] = [
  { id: 'CORD-04', name: 'Cluster 04 - Synchronized Account Subset', membersCount: 7, sharedItemsCount: 23, medianTimingGapSec: 42, similarityScore: 0.91, synchronyScore: 0.84, pValue: 0.003, fdrAdjusted: true, reviewState: 'UNREVIEWED', nodeIds: ['N184', 'N185', 'N186', 'N209'], summary: 'High posting synchrony (median gap 42s across 23 distinct image payloads). Statistical association detected with false discovery rate correction.' },
];

export const SYNTHETIC_EVIDENCE: EvidenceRecord[] = [
  { id: 'NX-2026-0917', timestamp: '2026-09-30 10:42:17 UTC', source: 'X + TELEGRAM PIPELINE', model: 'nexus-narrative-v3.4', confidence: 0.86, previousHash: '8b3e819fa210c422a912803fe89a19c402128e9d', recordHash: 'f91a783bc89104e8830192e21019f2ce849202a1', signatureStatus: 'VERIFIED', chainStatus: 'VALID', merkleCheckpoint: '0x8f2a...7c1', payloadSummary: 'Topic TP-8842 emergence detection record with p=0.003 coordination payload and N184 bridge activation state.' },
  { id: 'NX-2026-0916', timestamp: '2026-09-30 10:18:04 UTC', source: 'X GRAPH STREAM', model: 'nexus-topology-v2.1', confidence: 0.92, previousHash: '2a19e0481bc92019488a10984ef20a1f900142bc', recordHash: '8b3e819fa210c422a912803fe89a19c402128e9d', signatureStatus: 'VERIFIED', chainStatus: 'VALID', merkleCheckpoint: '0x7e11...3b8', payloadSummary: 'Betweenness score computation for Node N184 (betweenness=0.81, pageRank=0.64).' },
];

export const SYNTHETIC_DATASET: NexusDataset = {
  name: 'SYNTHETIC PIPELINE',
  metrics: SYNTHETIC_METRICS,
  narratives: SYNTHETIC_NARRATIVES,
  alerts: SYNTHETIC_ALERTS,
  timelineEvents: SYNTHETIC_TIMELINE,
  sentimentSeries: SYNTHETIC_SENTIMENT_SERIES,
  emotionBreakdown: SYNTHETIC_EMOTION_BREAKDOWN,
  networkNodes: SYNTHETIC_NETWORK_NODES,
  networkEdges: SYNTHETIC_NETWORK_EDGES,
  propagationSequence: SYNTHETIC_PROPAGATION,
  audienceClusters: SYNTHETIC_AUDIENCE,
  coordinationClusters: SYNTHETIC_COORDINATION,
  evidenceRecords: SYNTHETIC_EVIDENCE,
};


// =========================================================
// 2. ARCHIVE DATASET (Regional Narrative Archive — 14 Aug 2026)
// Narrative: REGIONAL POWER GRID FLUCTUATION (TP-7014)
// =========================================================

export const ARCHIVE_METRICS: IntelligenceMetric[] = [
  { key: 'events', label: 'EVENTS', value: 512190, format: 'number', delta: '+12,410 historical', isPositiveDelta: true, timestamp: 'ARCHIVE 14-AUG-2026' },
  { key: 'actors', label: 'OBSERVED ACTORS', value: 84102, format: 'number', delta: 'ARCHIVE RECORD', isPositiveDelta: true, timestamp: 'ARCHIVE 14-AUG-2026' },
  { key: 'topics', label: 'ACTIVE TOPICS', value: 182, format: 'number', delta: 'HISTORICAL SET', isPositiveDelta: true, timestamp: 'ARCHIVE 14-AUG-2026' },
  { key: 'alerts', label: 'INTELLIGENCE ALERTS', value: 18, format: 'number', delta: '3 CRITICAL ARCHIVED', isPositiveDelta: false, timestamp: 'ARCHIVE 14-AUG-2026' },
  { key: 'velocity', label: 'NARRATIVE VELOCITY', value: 24.8, format: 'percentage', delta: 'PEAK MOMENTUM', isPositiveDelta: true, timestamp: 'ARCHIVE 14-AUG-2026' },
];

export const ARCHIVE_NARRATIVES: EmergingNarrative[] = [
  {
    id: 'TP-7014',
    rank: '01',
    topic: 'REGIONAL POWER GRID FLUCTUATION',
    trendScore: 91,
    acceleration: '+410%',
    volume: '8.6K mentions / 2h',
    mentionCount: 8640,
    sentiment: { positive: 8, neutral: 18, negative: 74 },
    platforms: ['TELEGRAM', 'X', 'REDDIT'],
    communitiesCount: 8,
    primaryCommunity: 'Community 02 (Grid Sector)',
    keyBridgeNode: 'N092',
    summary: 'Archived cascade narrative concerning multi-district transformer outages that rapidly triggered public panic and grid maintenance rumors.',
    status: 'EMERGING',
  },
  {
    id: 'TP-7015',
    rank: '02',
    topic: 'HARVEST SUBSIDY DEBATE',
    trendScore: 82,
    acceleration: '+240%',
    volume: '4.8K mentions / 2h',
    mentionCount: 4820,
    sentiment: { positive: 22, neutral: 30, negative: 48 },
    platforms: ['REDDIT', 'YOUTUBE'],
    communitiesCount: 5,
    primaryCommunity: 'Community 05 (Agricultural Policy)',
    keyBridgeNode: 'N118',
    summary: 'Archived agricultural trade reform discourse with high rural forum participation.',
    status: 'EMERGING',
  },
];

export const ARCHIVE_ALERTS: IntelligenceAlert[] = [
  { id: 'ALT-ARC-01', time: '14-AUG 18:20 UTC', title: 'ARCHIVED GRID SIGNAL', detail: 'Voltage anomaly rumor crossed threshold in Community 02', type: 'EMERGING', topicId: 'TP-7014', read: true },
  { id: 'ALT-ARC-02', time: '14-AUG 17:45 UTC', title: 'ARCHIVED CROSSOVER', detail: 'Power outage report forwarded to 12 regional Telegram groups', type: 'CROSS_PLATFORM', topicId: 'TP-7014', read: true },
];

export const ARCHIVE_TIMELINE: TimelineEvent[] = [
  {
    id: 'EV-ARC-101',
    timestamp: '2026-08-14 18:45:00 UTC',
    timeAgo: '14 Aug 2026',
    minutesAgo: 5,
    platform: 'TELEGRAM',
    title: 'Grid Anomaly Warning Broadcast',
    description: 'Regional utility channel issued automated load shed alert amid local outage reports.',
    topicId: 'TP-7014',
    topicName: 'REGIONAL POWER GRID FLUCTUATION',
    eventCount: 410,
    sentimentDelta: '-12.4% Negative',
    community: 'Community 02',
    nodeId: 'N092',
    urgency: 'high',
  },
  {
    id: 'EV-ARC-102',
    timestamp: '2026-08-14 17:30:00 UTC',
    timeAgo: '14 Aug 2026',
    minutesAgo: 25,
    platform: 'X',
    title: 'Outage Hashtag Trend Surge',
    description: '#BlackoutAlert peaked across 3 major metropolitan districts.',
    topicId: 'TP-7014',
    topicName: 'REGIONAL POWER GRID FLUCTUATION',
    eventCount: 680,
    sentimentDelta: '-18.1% Negative',
    community: 'Community 04',
    nodeId: 'N184',
    urgency: 'high',
  },
  {
    id: 'EV-ARC-103',
    timestamp: '2026-08-14 16:15:00 UTC',
    timeAgo: '14 Aug 2026',
    minutesAgo: 120,
    platform: 'REDDIT',
    title: 'Subreddit Power Megathread',
    description: 'r/energy_india megathread collected 420 citizen outage reports in 1 hour.',
    topicId: 'TP-7014',
    topicName: 'REGIONAL POWER GRID FLUCTUATION',
    eventCount: 290,
    sentimentDelta: 'Negative 78%',
    community: 'Community 02',
    nodeId: 'N092',
    urgency: 'medium',
  },
];

export const ARCHIVE_DATASET: NexusDataset = {
  name: 'REGIONAL NARRATIVE ARCHIVE — 14 AUG 2026',
  metrics: ARCHIVE_METRICS,
  narratives: ARCHIVE_NARRATIVES,
  alerts: ARCHIVE_ALERTS,
  timelineEvents: ARCHIVE_TIMELINE,
  sentimentSeries: [
    { time: '12:00', positive: 18, neutral: 62, negative: 20, sarcasmLikelihood: 0.15 },
    { time: '14:00', positive: 14, neutral: 40, negative: 46, sarcasmLikelihood: 0.48 },
    { time: '16:00', positive: 8, neutral: 18, negative: 74, sarcasmLikelihood: 0.88 },
  ],
  emotionBreakdown: { supportive: 8, opposition: 42, anxiety: 32, anger: 12, excitement: 2, sarcasm: 4 },
  networkNodes: [
    { id: 'N092', label: 'Grid Host N092', communityId: 'C02', communityName: 'Community 02 (Grid Sector)', betweenness: 0.89, pageRank: 0.72, observedActivity: 410, platform: 'REDDIT', x: 320, y: 210, isBridge: true },
    { id: 'N184', label: 'News Account N184', communityId: 'C04', communityName: 'Community 04 (News Stream)', betweenness: 0.71, pageRank: 0.61, observedActivity: 290, platform: 'X', x: 510, y: 260, isBridge: true },
  ],
  networkEdges: [
    { id: 'EA1', source: 'N092', target: 'N184', type: 'forward', weight: 9.4 },
  ],
  propagationSequence: [
    { stepIndex: 1, time: '14:10 UTC', title: 'TRANSFORMER TRIP OBSERVED', entity: 'Substation 4B Telemetry', type: 'OBSERVED', detail: 'Voltage spike logged in public utility log.', platform: 'REDDIT', active: true },
    { stepIndex: 2, time: '14:35 UTC', title: 'TELEGRAM OUTAGE CHANNEL', entity: 'Community 02', type: 'COMMUNITY', detail: 'Citizens shared neighborhood dark spot photos.', platform: 'TELEGRAM', active: true },
  ],
  audienceClusters: [
    { id: 'CL-ARC-01', name: 'CLUSTER 02 (GRID AFFECTED)', ageBracket: '25–45 (68%)', languages: 'Regional / English', region: 'North-Western Power Zone', interests: 'Public Infrastructure', sampleSize: '12,400', confidence: 0.88, coverage: 0.82 },
  ],
  coordinationClusters: [
    { id: 'CORD-GRID-01', name: 'Cluster Grid-01 (Outage Copy Paste)', membersCount: 12, sharedItemsCount: 48, medianTimingGapSec: 18, similarityScore: 0.96, synchronyScore: 0.92, pValue: 0.001, fdrAdjusted: true, reviewState: 'UNREVIEWED', nodeIds: ['N092', 'N184'], summary: 'Historical coordinated panic text copy-pasting across regional channels.' },
  ],
  evidenceRecords: [
    { id: 'NX-2026-0814', timestamp: '2026-08-14 18:30:00 UTC', source: 'HISTORICAL ARCHIVE PIPELINE', model: 'nexus-narrative-v3.0', confidence: 0.91, previousHash: '4a10e82811a04910281b9e0129a00', recordHash: '1a90f2308103e9102830e0129a4', signatureStatus: 'VERIFIED', chainStatus: 'VALID', merkleCheckpoint: '0x3c90...2e1', payloadSummary: 'Archived Power Grid emergence record verified by Merkle checkpoint 0x3c90.' },
  ],
};


// =========================================================
// 3. LIVE DEMONSTRATION PIPELINE (Simulated Live Engine)
// Narrative: URBAN METRO AUTOMATION FAULT (TP-9901)
// =========================================================

export const LIVE_DEMO_METRICS: IntelligenceMetric[] = [
  { key: 'events', label: 'EVENTS', value: 318490, format: 'number', delta: '+1,240 live stream', isPositiveDelta: true, timestamp: 'LIVE PIPELINE' },
  { key: 'actors', label: 'OBSERVED ACTORS', value: 52190, format: 'number', delta: '+412 active', isPositiveDelta: true, timestamp: 'LIVE PIPELINE' },
  { key: 'topics', label: 'ACTIVE TOPICS', value: 142, format: 'number', delta: '+1 streaming', isPositiveDelta: true, timestamp: 'LIVE PIPELINE' },
  { key: 'alerts', label: 'INTELLIGENCE ALERTS', value: 15, format: 'number', delta: '4 UNREVIEWED', isPositiveDelta: false, timestamp: 'LIVE PIPELINE' },
  { key: 'velocity', label: 'NARRATIVE VELOCITY', value: 29.2, format: 'percentage', delta: '+8.4% SURGING', isPositiveDelta: true, timestamp: 'LIVE PIPELINE' },
];

export const LIVE_DEMO_NARRATIVES: EmergingNarrative[] = [
  {
    id: 'TP-9901',
    rank: '01',
    topic: 'URBAN METRO AUTOMATION FAULT',
    trendScore: 94,
    acceleration: '+520%',
    volume: '6.1K mentions / 2h',
    mentionCount: 6120,
    sentiment: { positive: 6, neutral: 14, negative: 80 },
    platforms: ['X', 'TELEGRAM', 'YOUTUBE', 'REDDIT'],
    communitiesCount: 9,
    primaryCommunity: 'Community 06 (Rapid Transit)',
    keyBridgeNode: 'N302',
    summary: 'Live simulated stream: Automated train braking anomaly reports spreading rapidly with video posts from central terminal.',
    status: 'EMERGING',
  },
];

export const LIVE_DEMO_DATASET: NexusDataset = {
  name: 'LIVE DEMONSTRATION PIPELINE',
  metrics: LIVE_DEMO_METRICS,
  narratives: LIVE_DEMO_NARRATIVES,
  alerts: [
    { id: 'ALT-LIVE-01', time: '11:58 UTC', title: 'LIVE STREAM ACCELERATION', detail: '+520% threshold crossed on Metro Automation Fault', type: 'EMERGING', topicId: 'TP-9901', read: false },
  ],
  timelineEvents: [
    { id: 'EV-LIVE-01', timestamp: '11:59:12 UTC', timeAgo: '30s ago', minutesAgo: 0, platform: 'X', title: 'Terminal Passenger Video Stream', description: 'Video clip showing stopped automated metro train gaining 840 retweets/min.', topicId: 'TP-9901', topicName: 'URBAN METRO AUTOMATION FAULT', eventCount: 520, sentimentDelta: '-18.4% Negative', community: 'Community 06', nodeId: 'N302', urgency: 'high' },
    { id: 'EV-LIVE-02', timestamp: '11:57:40 UTC', timeAgo: '2m ago', minutesAgo: 2, platform: 'TELEGRAM', title: 'Commuter Telegram Channel Alert', description: 'Group forward advising passengers to use alternate bus routes.', topicId: 'TP-9901', topicName: 'URBAN METRO AUTOMATION FAULT', eventCount: 280, sentimentDelta: '-12.0% Negative', community: 'Community 07', nodeId: 'N209', urgency: 'high' },
  ],
  sentimentSeries: [
    { time: '11:00', positive: 10, neutral: 30, negative: 60, sarcasmLikelihood: 0.65 },
    { time: '11:30', positive: 6, neutral: 14, negative: 80, sarcasmLikelihood: 0.91 },
  ],
  emotionBreakdown: { supportive: 6, opposition: 48, anxiety: 28, anger: 14, excitement: 2, sarcasm: 2 },
  networkNodes: [
    { id: 'N302', label: 'Transit Stream N302', communityId: 'C06', communityName: 'Community 06 (Rapid Transit)', betweenness: 0.94, pageRank: 0.81, observedActivity: 520, platform: 'X', x: 360, y: 240, isBridge: true },
  ],
  networkEdges: [],
  propagationSequence: [
    { stepIndex: 1, time: '11:50 UTC', title: 'BRAKING SENSOR LOGGED', entity: 'Central Terminal Sensors', type: 'OBSERVED', detail: 'Automated signal holding pattern initiated.', platform: 'X', active: true },
  ],
  audienceClusters: [
    { id: 'CL-LIVE-01', name: 'CLUSTER 06 (METRO COMMUTERS)', ageBracket: '20–35 (74%)', languages: 'English / Regional', region: 'Metropolitan Central', interests: 'Daily Transit', sampleSize: '8,920', confidence: 0.82, coverage: 0.76 },
  ],
  coordinationClusters: [
    { id: 'CORD-LIVE-01', name: 'Cluster Metro-Live', membersCount: 9, sharedItemsCount: 31, medianTimingGapSec: 14, similarityScore: 0.98, synchronyScore: 0.94, pValue: 0.001, fdrAdjusted: true, reviewState: 'UNREVIEWED', nodeIds: ['N302'], summary: 'Live simulated group synchrony across transit sub-channels.' },
  ],
  evidenceRecords: [
    { id: 'NX-2026-LIVE', timestamp: '2026-09-30 11:59:00 UTC', source: 'LIVE DEMO STREAM PIPELINE', model: 'nexus-narrative-v3.4-live', confidence: 0.89, previousHash: 'f91a783bc89104e8830192e21019f2ce849202a1', recordHash: '9901f2381203a9102830e0129a8', signatureStatus: 'VERIFIED', chainStatus: 'VALID', merkleCheckpoint: '0x9901...a12', payloadSummary: 'Live simulated Metro Automation emergence event.' },
  ],
};

export const DATASETS: Record<string, NexusDataset> = {
  SYNTHETIC: SYNTHETIC_DATASET,
  ARCHIVE: ARCHIVE_DATASET,
  LIVE: LIVE_DEMO_DATASET,
};

export interface OverviewSnapshot {
  metrics: IntelligenceMetric[];
  narratives: EmergingNarrative[];
  alerts: IntelligenceAlert[];
  sentimentSeries: SentimentDataPoint[];
}

export const OVERVIEW_SNAPSHOTS: Record<string, Record<string, OverviewSnapshot>> = {
  SYNTHETIC: {
    '10m': {
      metrics: [
        { key: 'events', label: 'EVENTS', value: 2840, format: 'number', delta: '+310 in 10m', isPositiveDelta: true, timestamp: '10M WINDOW' },
        { key: 'actors', label: 'OBSERVED ACTORS', value: 1420, format: 'number', delta: '+42 new', isPositiveDelta: true, timestamp: '10M WINDOW' },
        { key: 'topics', label: 'ACTIVE TOPICS', value: 14, format: 'number', delta: '+1 emerging', isPositiveDelta: true, timestamp: '10M WINDOW' },
        { key: 'alerts', label: 'INTELLIGENCE ALERTS', value: 2, format: 'number', delta: '1 critical', isPositiveDelta: false, timestamp: '10M WINDOW' },
        { key: 'velocity', label: 'NARRATIVE VELOCITY', value: 42.6, format: 'percentage', delta: '+18.2% surge', isPositiveDelta: true, timestamp: '10M WINDOW' },
      ],
      narratives: [
        {
          id: 'TP-8842',
          rank: '01',
          topic: 'PUBLIC TRANSPORT STRIKE',
          trendScore: 94,
          acceleration: '+480%',
          volume: '1.2K mentions / 10m',
          mentionCount: 1240,
          sentiment: { positive: 8, neutral: 14, negative: 78 },
          platforms: ['X', 'TELEGRAM'],
          communitiesCount: 4,
          primaryCommunity: 'Community 04',
          keyBridgeNode: 'N184',
          summary: 'Rapid burst of coordinated strike hashtags and telegram forward spikes within the latest 10-minute window.',
          status: 'EMERGING',
        },
        ...SYNTHETIC_NARRATIVES.slice(1),
      ],
      alerts: SYNTHETIC_ALERTS.slice(0, 2),
      sentimentSeries: [
        { time: '11:32', positive: 10, neutral: 28, negative: 62, sarcasmLikelihood: 0.78 },
        { time: '11:42', positive: 8, neutral: 14, negative: 78, sarcasmLikelihood: 0.86 },
      ],
    },
    '1h': {
      metrics: [
        { key: 'events', label: 'EVENTS', value: 24190, format: 'number', delta: '+1,820 in 1h', isPositiveDelta: true, timestamp: '1H WINDOW' },
        { key: 'actors', label: 'OBSERVED ACTORS', value: 8640, format: 'number', delta: '+112 new', isPositiveDelta: true, timestamp: '1H WINDOW' },
        { key: 'topics', label: 'ACTIVE TOPICS', value: 48, format: 'number', delta: '+2 emerging', isPositiveDelta: true, timestamp: '1H WINDOW' },
        { key: 'alerts', label: 'INTELLIGENCE ALERTS', value: 5, format: 'number', delta: '1 critical', isPositiveDelta: false, timestamp: '1H WINDOW' },
        { key: 'velocity', label: 'NARRATIVE VELOCITY', value: 31.4, format: 'percentage', delta: '+12.0% surge', isPositiveDelta: true, timestamp: '1H WINDOW' },
      ],
      narratives: [
        {
          id: 'TP-8842',
          rank: '01',
          topic: 'PUBLIC TRANSPORT STRIKE',
          trendScore: 91,
          acceleration: '+380%',
          volume: '2.8K mentions / 1h',
          mentionCount: 2810,
          sentiment: { positive: 10, neutral: 18, negative: 72 },
          platforms: ['X', 'TELEGRAM', 'YOUTUBE'],
          communitiesCount: 6,
          primaryCommunity: 'Community 04',
          keyBridgeNode: 'N184',
          summary: 'Accelerating strike mobilization thread activity across X, Telegram, and YouTube commentary clips.',
          status: 'EMERGING',
        },
        ...SYNTHETIC_NARRATIVES.slice(1),
      ],
      alerts: SYNTHETIC_ALERTS.slice(0, 3),
      sentimentSeries: [
        { time: '10:42', positive: 14, neutral: 32, negative: 54, sarcasmLikelihood: 0.62 },
        { time: '11:42', positive: 10, neutral: 18, negative: 72, sarcasmLikelihood: 0.84 },
      ],
    },
    '6h': {
      metrics: [
        { key: 'events', label: 'EVENTS', value: 98420, format: 'number', delta: '+3,100 in 6h', isPositiveDelta: true, timestamp: '6H WINDOW' },
        { key: 'actors', label: 'OBSERVED ACTORS', value: 21800, format: 'number', delta: '+210 new', isPositiveDelta: true, timestamp: '6H WINDOW' },
        { key: 'topics', label: 'ACTIVE TOPICS', value: 84, format: 'number', delta: '+3 emerging', isPositiveDelta: true, timestamp: '6H WINDOW' },
        { key: 'alerts', label: 'INTELLIGENCE ALERTS', value: 8, format: 'number', delta: '2 critical', isPositiveDelta: false, timestamp: '6H WINDOW' },
        { key: 'velocity', label: 'NARRATIVE VELOCITY', value: 22.8, format: 'percentage', delta: '+6.8% vs avg', isPositiveDelta: true, timestamp: '6H WINDOW' },
      ],
      narratives: SYNTHETIC_NARRATIVES,
      alerts: SYNTHETIC_ALERTS,
      sentimentSeries: SYNTHETIC_SENTIMENT_SERIES,
    },
    '24h': {
      metrics: SYNTHETIC_METRICS,
      narratives: SYNTHETIC_NARRATIVES,
      alerts: SYNTHETIC_ALERTS,
      sentimentSeries: SYNTHETIC_SENTIMENT_SERIES,
    },
    '7d': {
      metrics: [
        { key: 'events', label: 'EVENTS', value: 1840290, format: 'number', delta: '+18,400 in 7d', isPositiveDelta: true, timestamp: '7D WINDOW' },
        { key: 'actors', label: 'OBSERVED ACTORS', value: 148200, format: 'number', delta: '+1,240 new', isPositiveDelta: true, timestamp: '7D WINDOW' },
        { key: 'topics', label: 'ACTIVE TOPICS', value: 320, format: 'number', delta: '+8 emerging', isPositiveDelta: true, timestamp: '7D WINDOW' },
        { key: 'alerts', label: 'INTELLIGENCE ALERTS', value: 24, format: 'number', delta: '4 critical', isPositiveDelta: false, timestamp: '7D WINDOW' },
        { key: 'velocity', label: 'NARRATIVE VELOCITY', value: 14.2, format: 'percentage', delta: '+1.8% vs avg', isPositiveDelta: true, timestamp: '7D WINDOW' },
      ],
      narratives: SYNTHETIC_NARRATIVES.map((n) => ({
        ...n,
        volume: `${(n.mentionCount * 4).toLocaleString()} mentions / 7d`,
      })),
      alerts: SYNTHETIC_ALERTS,
      sentimentSeries: SYNTHETIC_SENTIMENT_SERIES,
    },
  },

  ARCHIVE: {
    '10m': {
      metrics: [
        { key: 'events', label: 'EVENTS', value: 4820, format: 'number', delta: '+420 in 10m', isPositiveDelta: true, timestamp: 'ARCHIVE 10M' },
        { key: 'actors', label: 'OBSERVED ACTORS', value: 2840, format: 'number', delta: '+68 in 10m', isPositiveDelta: true, timestamp: 'ARCHIVE 10M' },
        { key: 'topics', label: 'ACTIVE TOPICS', value: 18, format: 'number', delta: '+2 emerging', isPositiveDelta: true, timestamp: 'ARCHIVE 10M' },
        { key: 'alerts', label: 'INTELLIGENCE ALERTS', value: 3, format: 'number', delta: '1 critical', isPositiveDelta: false, timestamp: 'ARCHIVE 10M' },
        { key: 'velocity', label: 'NARRATIVE VELOCITY', value: 48.2, format: 'percentage', delta: '+22.1% surge', isPositiveDelta: true, timestamp: 'ARCHIVE 10M' },
      ],
      narratives: ARCHIVE_NARRATIVES,
      alerts: ARCHIVE_ALERTS,
      sentimentSeries: ARCHIVE_DATASET.sentimentSeries,
    },
    '1h': {
      metrics: [
        { key: 'events', label: 'EVENTS', value: 48200, format: 'number', delta: '+3,800 in 1h', isPositiveDelta: true, timestamp: 'ARCHIVE 1H' },
        { key: 'actors', label: 'OBSERVED ACTORS', value: 18400, format: 'number', delta: '+240 new', isPositiveDelta: true, timestamp: 'ARCHIVE 1H' },
        { key: 'topics', label: 'ACTIVE TOPICS', value: 62, format: 'number', delta: '+4 emerging', isPositiveDelta: true, timestamp: 'ARCHIVE 1H' },
        { key: 'alerts', label: 'INTELLIGENCE ALERTS', value: 8, format: 'number', delta: '2 critical', isPositiveDelta: false, timestamp: 'ARCHIVE 1H' },
        { key: 'velocity', label: 'NARRATIVE VELOCITY', value: 36.8, format: 'percentage', delta: '+16.4% surge', isPositiveDelta: true, timestamp: 'ARCHIVE 1H' },
      ],
      narratives: ARCHIVE_NARRATIVES,
      alerts: ARCHIVE_ALERTS,
      sentimentSeries: ARCHIVE_DATASET.sentimentSeries,
    },
    '6h': {
      metrics: [
        { key: 'events', label: 'EVENTS', value: 182400, format: 'number', delta: '+8,200 in 6h', isPositiveDelta: true, timestamp: 'ARCHIVE 6H' },
        { key: 'actors', label: 'OBSERVED ACTORS', value: 44200, format: 'number', delta: '+480 new', isPositiveDelta: true, timestamp: 'ARCHIVE 6H' },
        { key: 'topics', label: 'ACTIVE TOPICS', value: 110, format: 'number', delta: '+5 emerging', isPositiveDelta: true, timestamp: 'ARCHIVE 6H' },
        { key: 'alerts', label: 'INTELLIGENCE ALERTS', value: 12, format: 'number', delta: '3 critical', isPositiveDelta: false, timestamp: 'ARCHIVE 6H' },
        { key: 'velocity', label: 'NARRATIVE VELOCITY', value: 29.4, format: 'percentage', delta: '+9.2% vs avg', isPositiveDelta: true, timestamp: 'ARCHIVE 6H' },
      ],
      narratives: ARCHIVE_NARRATIVES,
      alerts: ARCHIVE_ALERTS,
      sentimentSeries: ARCHIVE_DATASET.sentimentSeries,
    },
    '24h': {
      metrics: ARCHIVE_METRICS,
      narratives: ARCHIVE_NARRATIVES,
      alerts: ARCHIVE_ALERTS,
      sentimentSeries: ARCHIVE_DATASET.sentimentSeries,
    },
    '7d': {
      metrics: [
        { key: 'events', label: 'EVENTS', value: 3120400, format: 'number', delta: '+42,800 in 7d', isPositiveDelta: true, timestamp: 'ARCHIVE 7D' },
        { key: 'actors', label: 'OBSERVED ACTORS', value: 240800, format: 'number', delta: '+3,200 set', isPositiveDelta: true, timestamp: 'ARCHIVE 7D' },
        { key: 'topics', label: 'ACTIVE TOPICS', value: 410, format: 'number', delta: '+12 historical', isPositiveDelta: true, timestamp: 'ARCHIVE 7D' },
        { key: 'alerts', label: 'INTELLIGENCE ALERTS', value: 32, format: 'number', delta: '6 critical', isPositiveDelta: false, timestamp: 'ARCHIVE 7D' },
        { key: 'velocity', label: 'NARRATIVE VELOCITY', value: 19.2, format: 'percentage', delta: '+3.4% vs avg', isPositiveDelta: true, timestamp: 'ARCHIVE 7D' },
      ],
      narratives: ARCHIVE_NARRATIVES,
      alerts: ARCHIVE_ALERTS,
      sentimentSeries: ARCHIVE_DATASET.sentimentSeries,
    },
  },

  LIVE: {
    '10m': {
      metrics: [
        { key: 'events', label: 'EVENTS', value: 3180, format: 'number', delta: '+480 live stream', isPositiveDelta: true, timestamp: 'LIVE 10M' },
        { key: 'actors', label: 'OBSERVED ACTORS', value: 1840, format: 'number', delta: '+82 active', isPositiveDelta: true, timestamp: 'LIVE 10M' },
        { key: 'topics', label: 'ACTIVE TOPICS', value: 16, format: 'number', delta: '+1 streaming', isPositiveDelta: true, timestamp: 'LIVE 10M' },
        { key: 'alerts', label: 'INTELLIGENCE ALERTS', value: 3, format: 'number', delta: '1 UNREVIEWED', isPositiveDelta: false, timestamp: 'LIVE 10M' },
        { key: 'velocity', label: 'NARRATIVE VELOCITY', value: 52.4, format: 'percentage', delta: '+24.1% SURGING', isPositiveDelta: true, timestamp: 'LIVE 10M' },
      ],
      narratives: LIVE_DEMO_NARRATIVES,
      alerts: LIVE_DEMO_DATASET.alerts,
      sentimentSeries: LIVE_DEMO_DATASET.sentimentSeries,
    },
    '1h': {
      metrics: [
        { key: 'events', label: 'EVENTS', value: 31840, format: 'number', delta: '+3,400 live stream', isPositiveDelta: true, timestamp: 'LIVE 1H' },
        { key: 'actors', label: 'OBSERVED ACTORS', value: 12800, format: 'number', delta: '+210 active', isPositiveDelta: true, timestamp: 'LIVE 1H' },
        { key: 'topics', label: 'ACTIVE TOPICS', value: 54, format: 'number', delta: '+2 streaming', isPositiveDelta: true, timestamp: 'LIVE 1H' },
        { key: 'alerts', label: 'INTELLIGENCE ALERTS', value: 7, format: 'number', delta: '2 UNREVIEWED', isPositiveDelta: false, timestamp: 'LIVE 1H' },
        { key: 'velocity', label: 'NARRATIVE VELOCITY', value: 41.2, format: 'percentage', delta: '+18.2% SURGING', isPositiveDelta: true, timestamp: 'LIVE 10M' },
      ],
      narratives: LIVE_DEMO_NARRATIVES,
      alerts: LIVE_DEMO_DATASET.alerts,
      sentimentSeries: LIVE_DEMO_DATASET.sentimentSeries,
    },
    '6h': {
      metrics: [
        { key: 'events', label: 'EVENTS', value: 118200, format: 'number', delta: '+6,800 live stream', isPositiveDelta: true, timestamp: 'LIVE 6H' },
        { key: 'actors', label: 'OBSERVED ACTORS', value: 28400, format: 'number', delta: '+380 active', isPositiveDelta: true, timestamp: 'LIVE 6H' },
        { key: 'topics', label: 'ACTIVE TOPICS', value: 92, format: 'number', delta: '+3 streaming', isPositiveDelta: true, timestamp: 'LIVE 6H' },
        { key: 'alerts', label: 'INTELLIGENCE ALERTS', value: 11, format: 'number', delta: '3 UNREVIEWED', isPositiveDelta: false, timestamp: 'LIVE 6H' },
        { key: 'velocity', label: 'NARRATIVE VELOCITY', value: 34.8, format: 'percentage', delta: '+12.6% SURGING', isPositiveDelta: true, timestamp: 'LIVE 6H' },
      ],
      narratives: LIVE_DEMO_NARRATIVES,
      alerts: LIVE_DEMO_DATASET.alerts,
      sentimentSeries: LIVE_DEMO_DATASET.sentimentSeries,
    },
    '24h': {
      metrics: LIVE_DEMO_METRICS,
      narratives: LIVE_DEMO_NARRATIVES,
      alerts: LIVE_DEMO_DATASET.alerts,
      sentimentSeries: LIVE_DEMO_DATASET.sentimentSeries,
    },
    '7d': {
      metrics: [
        { key: 'events', label: 'EVENTS', value: 2180400, format: 'number', delta: '+24,100 live stream', isPositiveDelta: true, timestamp: 'LIVE 7D' },
        { key: 'actors', label: 'OBSERVED ACTORS', value: 182400, format: 'number', delta: '+1,820 active', isPositiveDelta: true, timestamp: 'LIVE 7D' },
        { key: 'topics', label: 'ACTIVE TOPICS', value: 340, format: 'number', delta: '+6 streaming', isPositiveDelta: true, timestamp: 'LIVE 7D' },
        { key: 'alerts', label: 'INTELLIGENCE ALERTS', value: 28, format: 'number', delta: '5 UNREVIEWED', isPositiveDelta: false, timestamp: 'LIVE 7D' },
        { key: 'velocity', label: 'NARRATIVE VELOCITY', value: 21.6, format: 'percentage', delta: '+4.2% SURGING', isPositiveDelta: true, timestamp: 'LIVE 7D' },
      ],
      narratives: LIVE_DEMO_NARRATIVES,
      alerts: LIVE_DEMO_DATASET.alerts,
      sentimentSeries: LIVE_DEMO_DATASET.sentimentSeries,
    },
  },
};

