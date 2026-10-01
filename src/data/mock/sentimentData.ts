import { EmotionItem, PlatformSentimentComparison, SentimentDataPoint } from '../../types/nexus';

export const MOCK_SENTIMENT_SERIES: SentimentDataPoint[] = [
  { timestamp: '2026-10-01T00:00:00Z', timeLabel: '00:00', positive: 28, neutral: 42, negative: 30, volume: 820 },
  { timestamp: '2026-10-01T03:00:00Z', timeLabel: '03:00', positive: 25, neutral: 45, negative: 30, volume: 640 },
  { timestamp: '2026-10-01T06:00:00Z', timeLabel: '06:00', positive: 18, neutral: 32, negative: 50, volume: 1450 },
  { timestamp: '2026-10-01T09:00:00Z', timeLabel: '09:00', positive: 14, neutral: 23, negative: 63, volume: 3820 },
  { timestamp: '2026-10-01T12:00:00Z', timeLabel: '12:00', positive: 16, neutral: 21, negative: 63, volume: 4280 },
  { timestamp: '2026-10-01T15:00:00Z', timeLabel: '15:00', positive: 19, neutral: 25, negative: 56, volume: 2950 },
  { timestamp: '2026-10-01T18:00:00Z', timeLabel: '18:00', positive: 22, neutral: 28, negative: 50, volume: 2100 },
  { timestamp: '2026-10-01T21:00:00Z', timeLabel: '21:00', positive: 24, neutral: 34, negative: 42, volume: 1320 },
];

export const MOCK_EMOTION_DISTRIBUTION: EmotionItem[] = [
  {
    emotion: 'anxiety',
    label: 'Anxiety & Commuter Distress',
    percentage: 38,
    volume: 4880,
    trendDelta: '+14% vs yesterday',
    description: 'Concerns regarding stranded family members, missed employment shifts, and dynamic fare inflation.'
  },
  {
    emotion: 'supportive',
    label: 'Supportive & Community Coordination',
    percentage: 22,
    volume: 2825,
    trendDelta: '+8% vs yesterday',
    description: 'Mutual aid carpooling initiatives, civic volunteer marshaling, and peer route guidance.'
  },
  {
    emotion: 'opposition',
    label: 'Opposition & Policy Pushback',
    percentage: 19,
    volume: 2440,
    trendDelta: '+5% vs yesterday',
    description: 'Demands for administrative resignation, fare cap legislation, and union leadership critiques.'
  },
  {
    emotion: 'excitement',
    label: 'Excitement & Reform Optimism',
    percentage: 14,
    volume: 1797,
    trendDelta: '-3% vs yesterday',
    description: 'Support for modernization pilots, digital ticket platforms, and electric bus deployment.'
  },
  {
    emotion: 'sarcasm',
    label: 'Sarcasm & Public Irony',
    percentage: 7,
    volume: 898,
    trendDelta: '+2% vs yesterday',
    description: 'Satirical memes, ironic gratitude toward municipal bodies, and humorous commuter parodies.'
  }
];

export const MOCK_PLATFORM_SENTIMENT: PlatformSentimentComparison[] = [
  {
    platform: 'reddit',
    platformName: 'Reddit',
    positivePct: 15,
    neutralPct: 22,
    negativePct: 63,
    totalVolume: 3420
  },
  {
    platform: 'telegram',
    platformName: 'Telegram',
    positivePct: 12,
    neutralPct: 18,
    negativePct: 70,
    totalVolume: 4180
  },
  {
    platform: 'x',
    platformName: 'X (Twitter)',
    positivePct: 20,
    neutralPct: 19,
    negativePct: 61,
    totalVolume: 4350
  },
  {
    platform: 'youtube',
    platformName: 'YouTube',
    positivePct: 28,
    neutralPct: 34,
    negativePct: 38,
    totalVolume: 892
  }
];
