import { OverviewData } from '../../types/nexus';

export const MOCK_OVERVIEW_DATA: OverviewData = {
  metrics: {
    totalPosts: 12842,
    activeTopicsCount: 47,
    emergingGrowthPct: 182,
    negativeSentimentPct: 63,
    lastUpdatedSecondsAgo: 12,
  },
  narratives: [
    {
      id: 'NAR-01',
      name: 'Public Transport Strike & Fare Revision',
      summary: 'Spontaneous strike announcement across metropolitan bus depots triggered widespread commuter distress, coordination of alternate carpools, and rapid escalation to municipal accountability demands.',
      growthPct: 312,
      mentionCount: 4281,
      sentiment: 'negative',
      dominantEmotion: 'anxiety',
      platforms: ['x', 'telegram', 'reddit'],
      sparkline: [12, 19, 34, 48, 85, 142, 290, 480],
      accelerationScore: 9.4,
      firstObserved: '06:14 UTC',
      lastObserved: 'Just now',
      communityIds: ['comm-1', 'comm-2', 'comm-4'],
      keyQuotes: [
        {
          author: '@metro_watch',
          platform: 'x',
          text: 'Depot 4 and 7 operators have ceased morning shifts. Commuters stranded at central interchanges.',
          timestamp: '07:22'
        },
        {
          author: 'TransitActionHQ',
          platform: 'telegram',
          text: 'Negotiation bulletin #3 released: union representatives demand immediate rollback of fuel surcharge.',
          timestamp: '08:05'
        }
      ]
    },
    {
      id: 'NAR-02',
      name: 'Emergency Healthcare Ordinance Debate',
      summary: 'Public discourse regarding new pharmaceutical procurement guidelines, marked by sharp policy debate between medical unions and civic consumer forums.',
      growthPct: 184,
      mentionCount: 2812,
      sentiment: 'neutral',
      dominantEmotion: 'opposition',
      platforms: ['x', 'reddit', 'youtube'],
      sparkline: [22, 28, 45, 60, 92, 115, 178, 230],
      accelerationScore: 7.8,
      firstObserved: 'Yesterday 21:00',
      lastObserved: '4m ago',
      communityIds: ['comm-2', 'comm-3'],
      keyQuotes: [
        {
          author: 'u/CivicHealthObserver',
          platform: 'reddit',
          text: 'The comparative analysis between Schedule A and B procurement shows a 14% gap in tier-2 clinic supply.',
          timestamp: '06:50'
        }
      ]
    },
    {
      id: 'NAR-03',
      name: 'Municipal Cleanliness & Waste Route Overhaul',
      summary: 'Citizen-led documentation of rescheduled sanitation corridors, resulting in localized community volunteer initiatives alongside municipal feedback.',
      growthPct: 96,
      mentionCount: 1420,
      sentiment: 'positive',
      dominantEmotion: 'supportive',
      platforms: ['x', 'telegram'],
      sparkline: [15, 18, 24, 30, 42, 58, 80, 112],
      accelerationScore: 5.6,
      firstObserved: 'Yesterday 14:30',
      lastObserved: '18m ago',
      communityIds: ['comm-1', 'comm-3'],
      keyQuotes: [
        {
          author: '@GreenWardAlliance',
          platform: 'x',
          text: 'Morning audit confirmed 94% on-time container clearances across sector 9 and 12.',
          timestamp: '08:12'
        }
      ]
    },
    {
      id: 'NAR-04',
      name: 'Secondary Education Tech Infrastructure Pilot',
      summary: 'Evaluation and student feedback surrounding automated attendance and digital textbook rollouts across 120 district academies.',
      growthPct: 74,
      mentionCount: 980,
      sentiment: 'neutral',
      dominantEmotion: 'excitement',
      platforms: ['youtube', 'reddit'],
      sparkline: [8, 12, 15, 22, 35, 48, 62, 79],
      accelerationScore: 4.2,
      firstObserved: '2 days ago',
      lastObserved: '35m ago',
      communityIds: ['comm-3', 'comm-4'],
      keyQuotes: [
        {
          author: 'EduTechInsights',
          platform: 'youtube',
          text: 'Field benchmark of the tablet synchronization model shows minimal latency during peak morning login.',
          timestamp: 'Yesterday'
        }
      ]
    }
  ],
  sentimentBreakdown: {
    positive: 18,
    neutral: 19,
    negative: 63
  },
  audience: {
    ageGroups: [
      { range: '18–24', percentage: 48 },
      { range: '25–34', percentage: 29 },
      { range: '35–49', percentage: 16 },
      { range: '50+', percentage: 7 }
    ],
    languages: [
      { language: 'Hindi / English', percentage: 61 },
      { language: 'English Only', percentage: 24 },
      { language: 'Regional Dialects', percentage: 15 }
    ],
    regions: [
      { region: 'Western Region', percentage: 43 },
      { region: 'Northern Metros', percentage: 31 },
      { region: 'Southern Hubs', percentage: 18 },
      { region: 'Eastern Districts', percentage: 8 }
    ],
    methodologyNote: 'Inferred at macro aggregate cohort level based on linguistic syntax and geotemporal density. Zero individual-level tracking.'
  },
  networkSummary: {
    activeCommunities: 4,
    bridgeNodesCount: 2,
    monitoredNodes: 142
  }
};
