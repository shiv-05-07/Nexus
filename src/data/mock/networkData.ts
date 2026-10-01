import { NetworkCommunity, NetworkEdge, NetworkNode, Platform } from '../../types/nexus';

export const MOCK_COMMUNITIES: NetworkCommunity[] = [
  {
    id: 'comm-1',
    name: 'Transit & Commuter Groups',
    color: '#2563EB',
    nodeCount: 48,
    dominantSentiment: 'negative',
    description: 'Daily passenger associations, regional carpool networks, and neighborhood mobility groups.'
  },
  {
    id: 'comm-2',
    name: 'Municipal & Operator Councils',
    color: '#7C3AED',
    nodeCount: 36,
    dominantSentiment: 'neutral',
    description: 'Transit directorate liaisons, operator union representatives, and municipal logistics desks.'
  },
  {
    id: 'comm-3',
    name: 'Civic & Policy Watchdogs',
    color: '#0891B2',
    nodeCount: 32,
    dominantSentiment: 'negative',
    description: 'Consumer rights advocates, municipal audit observers, and public policy analysts.'
  },
  {
    id: 'comm-4',
    name: 'Media & Dispatch Outlets',
    color: '#D97706',
    nodeCount: 26,
    dominantSentiment: 'neutral',
    description: 'Regional news wires, traffic dispatch radio accounts, and digital livestream reporters.'
  }
];

// Master reference timestamp for mock stream: 2026-10-01T09:00:00Z
const REF_MS = Date.parse('2026-10-01T09:00:00Z');
const MS_PER_DAY = 86400 * 1000;
const MS_PER_HOUR = 3600 * 1000;

export interface TimedNetworkNode extends NetworkNode {
  firstSeenTimestamp: string;
  lastActiveTimestamp: string;
  coordinatesByHorizon: {
    '24h': { x: number; y: number };
    '7d': { x: number; y: number };
    '30d': { x: number; y: number };
  };
}

export interface TimedNetworkEdge extends NetworkEdge {
  timestamp: string;
}

export const MOCK_NETWORK_NODES: TimedNetworkNode[] = [
  // --- TELEGRAM NODES ---
  {
    id: 'node-tg-01',
    label: 'TransitActionHQ',
    alias: 'Union Information Desk',
    communityId: 'comm-2',
    communityName: 'Municipal & Operator Councils',
    role: 'Union Spokesperson',
    platform: 'telegram',
    pagerank: 0.088,
    betweenness: 0.145,
    connectionsCount: 36,
    isBridge: false,
    x: 480,
    y: 180,
    recentTopics: ['Public Transport Strike & Fare Revision'],
    activityVolume: 740,
    avatarColor: '#7C3AED',
    firstSeenTimestamp: new Date(REF_MS - 25 * MS_PER_DAY).toISOString(),
    lastActiveTimestamp: new Date(REF_MS - 1.5 * MS_PER_HOUR).toISOString(),
    coordinatesByHorizon: {
      '24h': { x: 480, y: 190 },
      '7d': { x: 480, y: 180 },
      '30d': { x: 470, y: 170 },
    }
  },
  {
    id: 'node-tg-02',
    label: '@commuter_liaison',
    alias: 'Inter-Community Mediator',
    communityId: 'comm-1',
    communityName: 'Transit & Commuter Groups',
    role: 'Structural Bridge Node',
    platform: 'telegram',
    pagerank: 0.096,
    betweenness: 0.312,
    connectionsCount: 44,
    isBridge: true,
    x: 350,
    y: 260,
    recentTopics: ['Public Transport Strike & Fare Revision', 'Carpool Inter-City Coordination Protocol'],
    activityVolume: 980,
    avatarColor: '#2563EB',
    firstSeenTimestamp: new Date(REF_MS - 26 * MS_PER_DAY).toISOString(),
    lastActiveTimestamp: new Date(REF_MS - 1.2 * MS_PER_HOUR).toISOString(),
    coordinatesByHorizon: {
      '24h': { x: 360, y: 260 },
      '7d': { x: 350, y: 260 },
      '30d': { x: 340, y: 250 },
    }
  },
  {
    id: 'node-tg-03',
    label: 'MetroFleetOps',
    alias: 'Depot Fleet Coordinator',
    communityId: 'comm-2',
    communityName: 'Municipal & Operator Councils',
    role: 'Technical Operations',
    platform: 'telegram',
    pagerank: 0.056,
    betweenness: 0.082,
    connectionsCount: 26,
    isBridge: false,
    x: 610,
    y: 210,
    recentTopics: ['Public Transport Strike & Fare Revision'],
    activityVolume: 530,
    avatarColor: '#7C3AED',
    firstSeenTimestamp: new Date(REF_MS - 24 * MS_PER_DAY).toISOString(),
    lastActiveTimestamp: new Date(REF_MS - 3 * MS_PER_HOUR).toISOString(),
    coordinatesByHorizon: {
      '24h': { x: 610, y: 210 },
      '7d': { x: 590, y: 200 },
      '30d': { x: 580, y: 190 },
    }
  },
  {
    id: 'node-tg-04',
    label: 'RideShareReliefGroup',
    alias: 'Volunteer Carpool Relay',
    communityId: 'comm-1',
    communityName: 'Transit & Commuter Groups',
    role: 'Mutual Aid Facilitator',
    platform: 'telegram',
    pagerank: 0.068,
    betweenness: 0.104,
    connectionsCount: 28,
    isBridge: false,
    x: 210,
    y: 290,
    recentTopics: ['Carpool Inter-City Coordination Protocol', 'Public Transport Strike & Fare Revision'],
    activityVolume: 610,
    avatarColor: '#2563EB',
    firstSeenTimestamp: new Date(REF_MS - 14 * MS_PER_DAY).toISOString(),
    lastActiveTimestamp: new Date(REF_MS - 2 * MS_PER_HOUR).toISOString(),
    coordinatesByHorizon: {
      '24h': { x: 210, y: 290 },
      '7d': { x: 220, y: 280 },
      '30d': { x: 210, y: 270 },
    }
  },
  {
    id: 'node-tg-05',
    label: 'CityAlertChannel',
    alias: 'Emergency Alert Bot',
    communityId: 'comm-4',
    communityName: 'Media & Dispatch Outlets',
    role: 'Real-Time Alert Broadcaster',
    platform: 'telegram',
    pagerank: 0.084,
    betweenness: 0.188,
    connectionsCount: 38,
    isBridge: true,
    x: 480,
    y: 370,
    recentTopics: ['Public Transport Strike & Fare Revision', 'Traffic Alerts'],
    activityVolume: 890,
    avatarColor: '#D97706',
    firstSeenTimestamp: new Date(REF_MS - 22 * MS_PER_DAY).toISOString(),
    lastActiveTimestamp: new Date(REF_MS - 1.8 * MS_PER_HOUR).toISOString(),
    coordinatesByHorizon: {
      '24h': { x: 480, y: 370 },
      '7d': { x: 480, y: 360 },
      '30d': { x: 470, y: 350 },
    }
  },
  {
    id: 'node-tg-06',
    label: 'CivicTelegramAlliance',
    alias: 'Neighborhood Commuter Council',
    communityId: 'comm-3',
    communityName: 'Civic & Policy Watchdogs',
    role: 'Civic Community Liaison',
    platform: 'telegram',
    pagerank: 0.052,
    betweenness: 0.076,
    connectionsCount: 22,
    isBridge: false,
    x: 320,
    y: 430,
    recentTopics: ['Municipal Cleanliness & Waste Route Overhaul'],
    activityVolume: 420,
    avatarColor: '#0891B2',
    firstSeenTimestamp: new Date(REF_MS - 18 * MS_PER_DAY).toISOString(),
    lastActiveTimestamp: new Date(REF_MS - 3.8 * MS_PER_DAY).toISOString(),
    coordinatesByHorizon: {
      '24h': { x: 320, y: 430 },
      '7d': { x: 320, y: 430 },
      '30d': { x: 310, y: 440 },
    }
  },

  // --- X (TWITTER) NODES ---
  {
    id: 'node-x-01',
    label: '@metro_watch',
    alias: 'Metro Transit Wire',
    communityId: 'comm-1',
    communityName: 'Transit & Commuter Groups',
    role: 'Central Commuter Hub',
    platform: 'x',
    pagerank: 0.092,
    betweenness: 0.162,
    connectionsCount: 42,
    isBridge: false,
    x: 230,
    y: 190,
    recentTopics: ['Public Transport Strike & Fare Revision', 'Carpool Inter-City Coordination Protocol'],
    activityVolume: 920,
    avatarColor: '#2563EB',
    firstSeenTimestamp: new Date(REF_MS - 28 * MS_PER_DAY).toISOString(),
    lastActiveTimestamp: new Date(REF_MS - 1.8 * MS_PER_HOUR).toISOString(),
    coordinatesByHorizon: {
      '24h': { x: 230, y: 200 },
      '7d': { x: 230, y: 190 },
      '30d': { x: 220, y: 180 },
    }
  },
  {
    id: 'node-x-02',
    label: '@urban_pulse_in',
    alias: 'Urban Dispatch Network',
    communityId: 'comm-4',
    communityName: 'Media & Dispatch Outlets',
    role: 'High-Volume News Node',
    platform: 'x',
    pagerank: 0.095,
    betweenness: 0.198,
    connectionsCount: 46,
    isBridge: false,
    x: 620,
    y: 280,
    recentTopics: ['Public Transport Strike & Fare Revision', 'Municipal Cleanliness & Waste Route Overhaul'],
    activityVolume: 1350,
    avatarColor: '#D97706',
    firstSeenTimestamp: new Date(REF_MS - 25 * MS_PER_DAY).toISOString(),
    lastActiveTimestamp: new Date(REF_MS - 2.1 * MS_PER_HOUR).toISOString(),
    coordinatesByHorizon: {
      '24h': { x: 620, y: 280 },
      '7d': { x: 610, y: 280 },
      '30d': { x: 600, y: 270 },
    }
  },
  {
    id: 'node-x-03',
    label: '@press_transit_desk',
    alias: 'Senior Transport Correspondent',
    communityId: 'comm-4',
    communityName: 'Media & Dispatch Outlets',
    role: 'Cross-Sector Bridge Node',
    platform: 'x',
    pagerank: 0.098,
    betweenness: 0.324,
    connectionsCount: 50,
    isBridge: true,
    x: 480,
    y: 270,
    recentTopics: ['Public Transport Strike & Fare Revision', 'Surge Pricing Anti-Gouging Petitions'],
    activityVolume: 1190,
    avatarColor: '#D97706',
    firstSeenTimestamp: new Date(REF_MS - 28 * MS_PER_DAY).toISOString(),
    lastActiveTimestamp: new Date(REF_MS - 1.1 * MS_PER_HOUR).toISOString(),
    coordinatesByHorizon: {
      '24h': { x: 480, y: 280 },
      '7d': { x: 480, y: 270 },
      '30d': { x: 470, y: 260 },
    }
  },
  {
    id: 'node-x-04',
    label: '@dept_mobility',
    alias: 'Municipal Logistics Desk',
    communityId: 'comm-2',
    communityName: 'Municipal & Operator Councils',
    role: 'Regulatory Authority',
    platform: 'x',
    pagerank: 0.074,
    betweenness: 0.138,
    connectionsCount: 30,
    isBridge: false,
    x: 560,
    y: 120,
    recentTopics: ['Fare Revision Governance Framework', 'Fleet Operations'],
    activityVolume: 660,
    avatarColor: '#7C3AED',
    firstSeenTimestamp: new Date(REF_MS - 30 * MS_PER_DAY).toISOString(),
    lastActiveTimestamp: new Date(REF_MS - 8 * MS_PER_HOUR).toISOString(),
    coordinatesByHorizon: {
      '24h': { x: 560, y: 120 },
      '7d': { x: 560, y: 120 },
      '30d': { x: 550, y: 110 },
    }
  },
  {
    id: 'node-x-05',
    label: '@CitizenActionWard7',
    alias: 'Ward 7 Civic Alliance',
    communityId: 'comm-3',
    communityName: 'Civic & Policy Watchdogs',
    role: 'Local Council Watchdog',
    platform: 'x',
    pagerank: 0.054,
    betweenness: 0.072,
    connectionsCount: 20,
    isBridge: false,
    x: 250,
    y: 380,
    recentTopics: ['Municipal Cleanliness & Waste Route Overhaul'],
    activityVolume: 340,
    avatarColor: '#0891B2',
    firstSeenTimestamp: new Date(REF_MS - 20 * MS_PER_DAY).toISOString(),
    lastActiveTimestamp: new Date(REF_MS - 4.5 * MS_PER_DAY).toISOString(),
    coordinatesByHorizon: {
      '24h': { x: 250, y: 380 },
      '7d': { x: 250, y: 380 },
      '30d': { x: 240, y: 390 },
    }
  },
  {
    id: 'node-x-06',
    label: '@MedicalFrontVoice',
    alias: 'Physicians Guild',
    communityId: 'comm-3',
    communityName: 'Civic & Policy Watchdogs',
    role: 'Public Health Liaison',
    platform: 'x',
    pagerank: 0.062,
    betweenness: 0.091,
    connectionsCount: 24,
    isBridge: false,
    x: 380,
    y: 410,
    recentTopics: ['Emergency Healthcare Ordinance Debate'],
    activityVolume: 480,
    avatarColor: '#0891B2',
    firstSeenTimestamp: new Date(REF_MS - 21 * MS_PER_DAY).toISOString(),
    lastActiveTimestamp: new Date(REF_MS - 2.8 * MS_PER_DAY).toISOString(),
    coordinatesByHorizon: {
      '24h': { x: 380, y: 410 },
      '7d': { x: 380, y: 410 },
      '30d': { x: 370, y: 410 },
    }
  },

  // --- REDDIT NODES ---
  {
    id: 'node-rd-01',
    label: 'u/CivicHealthObserver',
    alias: 'Healthcare Policy Watch',
    communityId: 'comm-3',
    communityName: 'Civic & Policy Watchdogs',
    role: 'Policy Researcher',
    platform: 'reddit',
    pagerank: 0.078,
    betweenness: 0.125,
    connectionsCount: 32,
    isBridge: false,
    x: 320,
    y: 390,
    recentTopics: ['Emergency Healthcare Ordinance Debate'],
    activityVolume: 510,
    avatarColor: '#0891B2',
    firstSeenTimestamp: new Date(REF_MS - 24 * MS_PER_DAY).toISOString(),
    lastActiveTimestamp: new Date(REF_MS - 2.5 * MS_PER_HOUR).toISOString(),
    coordinatesByHorizon: {
      '24h': { x: 320, y: 390 },
      '7d': { x: 320, y: 390 },
      '30d': { x: 310, y: 400 },
    }
  },
  {
    id: 'node-rd-02',
    label: 'u/CommuterVoice_HQ',
    alias: 'Civic Mobility Observer',
    communityId: 'comm-1',
    communityName: 'Transit & Commuter Groups',
    role: 'Central Commuter Megathread Host',
    platform: 'reddit',
    pagerank: 0.089,
    betweenness: 0.284,
    connectionsCount: 40,
    isBridge: true,
    x: 240,
    y: 230,
    recentTopics: ['Public Transport Strike & Fare Revision'],
    activityVolume: 880,
    avatarColor: '#2563EB',
    firstSeenTimestamp: new Date(REF_MS - 27 * MS_PER_DAY).toISOString(),
    lastActiveTimestamp: new Date(REF_MS - 1.4 * MS_PER_HOUR).toISOString(),
    coordinatesByHorizon: {
      '24h': { x: 240, y: 230 },
      '7d': { x: 240, y: 230 },
      '30d': { x: 230, y: 220 },
    }
  },
  {
    id: 'node-rd-03',
    label: 'u/TechWorkerExpress',
    alias: 'IT Corridor Representative',
    communityId: 'comm-1',
    communityName: 'Transit & Commuter Groups',
    role: 'Carpool & Shuttle Coordination',
    platform: 'reddit',
    pagerank: 0.065,
    betweenness: 0.098,
    connectionsCount: 26,
    isBridge: false,
    x: 180,
    y: 320,
    recentTopics: ['Public Transport Strike & Fare Revision', 'Carpool Inter-City Coordination Protocol'],
    activityVolume: 610,
    avatarColor: '#2563EB',
    firstSeenTimestamp: new Date(REF_MS - 16 * MS_PER_DAY).toISOString(),
    lastActiveTimestamp: new Date(REF_MS - 2.8 * MS_PER_HOUR).toISOString(),
    coordinatesByHorizon: {
      '24h': { x: 180, y: 320 },
      '7d': { x: 180, y: 320 },
      '30d': { x: 170, y: 310 },
    }
  },
  {
    id: 'node-rd-04',
    label: 'u/MetroCommuteUnion',
    alias: 'Regional Labor Council',
    communityId: 'comm-2',
    communityName: 'Municipal & Operator Councils',
    role: 'Organized Labor Federation',
    platform: 'reddit',
    pagerank: 0.076,
    betweenness: 0.142,
    connectionsCount: 31,
    isBridge: false,
    x: 490,
    y: 190,
    recentTopics: ['Collective Bargaining Agreements', 'Shift Logistics'],
    activityVolume: 640,
    avatarColor: '#7C3AED',
    firstSeenTimestamp: new Date(REF_MS - 29 * MS_PER_DAY).toISOString(),
    lastActiveTimestamp: new Date(REF_MS - 5 * MS_PER_HOUR).toISOString(),
    coordinatesByHorizon: {
      '24h': { x: 490, y: 190 },
      '7d': { x: 490, y: 190 },
      '30d': { x: 480, y: 180 },
    }
  },
  {
    id: 'node-rd-05',
    label: 'r/TransitOpenData',
    alias: 'Open Transit Analytics',
    communityId: 'comm-4',
    communityName: 'Media & Dispatch Outlets',
    role: 'Crowdsourced Data Monitor',
    platform: 'reddit',
    pagerank: 0.072,
    betweenness: 0.118,
    connectionsCount: 28,
    isBridge: true,
    x: 580,
    y: 330,
    recentTopics: ['Public Transport Strike & Fare Revision'],
    activityVolume: 720,
    avatarColor: '#D97706',
    firstSeenTimestamp: new Date(REF_MS - 23 * MS_PER_DAY).toISOString(),
    lastActiveTimestamp: new Date(REF_MS - 3.2 * MS_PER_HOUR).toISOString(),
    coordinatesByHorizon: {
      '24h': { x: 580, y: 330 },
      '7d': { x: 580, y: 330 },
      '30d': { x: 570, y: 320 },
    }
  },

  // --- YOUTUBE NODES ---
  {
    id: 'node-yt-01',
    label: 'PolicyDeepDiveMedia',
    alias: 'Policy Analysis Stream',
    communityId: 'comm-3',
    communityName: 'Civic & Policy Watchdogs',
    role: 'Healthcare Policy Analyst',
    platform: 'youtube',
    pagerank: 0.082,
    betweenness: 0.164,
    connectionsCount: 34,
    isBridge: false,
    x: 310,
    y: 360,
    recentTopics: ['Emergency Healthcare Ordinance Debate'],
    activityVolume: 680,
    avatarColor: '#0891B2',
    firstSeenTimestamp: new Date(REF_MS - 24 * MS_PER_DAY).toISOString(),
    lastActiveTimestamp: new Date(REF_MS - 2.5 * MS_PER_HOUR).toISOString(),
    coordinatesByHorizon: {
      '24h': { x: 310, y: 360 },
      '7d': { x: 310, y: 360 },
      '30d': { x: 300, y: 360 },
    }
  },
  {
    id: 'node-yt-02',
    label: 'EduReformChannel',
    alias: 'Education Reform Wire',
    communityId: 'comm-4',
    communityName: 'Media & Dispatch Outlets',
    role: 'Specialized Media Stream',
    platform: 'youtube',
    pagerank: 0.064,
    betweenness: 0.098,
    connectionsCount: 24,
    isBridge: false,
    x: 650,
    y: 340,
    recentTopics: ['Secondary Education Tech Infrastructure Pilot'],
    activityVolume: 490,
    avatarColor: '#D97706',
    firstSeenTimestamp: new Date(REF_MS - 22 * MS_PER_DAY).toISOString(),
    lastActiveTimestamp: new Date(REF_MS - 4.2 * MS_PER_DAY).toISOString(),
    coordinatesByHorizon: {
      '24h': { x: 650, y: 340 },
      '7d': { x: 650, y: 340 },
      '30d': { x: 640, y: 340 },
    }
  },
  {
    id: 'node-yt-03',
    label: 'AuditTransparency',
    alias: 'Public Expenditure Watchdog',
    communityId: 'comm-3',
    communityName: 'Civic & Policy Watchdogs',
    role: 'Civic Ombudsman Broadcast',
    platform: 'youtube',
    pagerank: 0.075,
    betweenness: 0.142,
    connectionsCount: 29,
    isBridge: false,
    x: 390,
    y: 440,
    recentTopics: ['Transit Subsidies Audit', 'Infrastructure Transparency'],
    activityVolume: 560,
    avatarColor: '#0891B2',
    firstSeenTimestamp: new Date(REF_MS - 30 * MS_PER_DAY).toISOString(),
    lastActiveTimestamp: new Date(REF_MS - 6.2 * MS_PER_DAY).toISOString(),
    coordinatesByHorizon: {
      '24h': { x: 390, y: 440 },
      '7d': { x: 390, y: 440 },
      '30d': { x: 390, y: 440 },
    }
  },
  {
    id: 'node-yt-04',
    label: 'StateNewsWire',
    alias: 'National News Agency',
    communityId: 'comm-4',
    communityName: 'Media & Dispatch Outlets',
    role: 'Institutional News Stream',
    platform: 'youtube',
    pagerank: 0.094,
    betweenness: 0.285,
    connectionsCount: 42,
    isBridge: true,
    x: 520,
    y: 220,
    recentTopics: ['Statewide Transit Directives', 'Economic Impact Reports'],
    activityVolume: 920,
    avatarColor: '#D97706',
    firstSeenTimestamp: new Date(REF_MS - 30 * MS_PER_DAY).toISOString(),
    lastActiveTimestamp: new Date(REF_MS - 1.8 * MS_PER_HOUR).toISOString(),
    coordinatesByHorizon: {
      '24h': { x: 520, y: 220 },
      '7d': { x: 520, y: 220 },
      '30d': { x: 510, y: 210 },
    }
  },
  {
    id: 'node-yt-05',
    label: 'CommuterVoiceYT',
    alias: 'Commuter Rights Channel',
    communityId: 'comm-1',
    communityName: 'Transit & Commuter Groups',
    role: 'Passenger Advocacy Livestream',
    platform: 'youtube',
    pagerank: 0.071,
    betweenness: 0.114,
    connectionsCount: 26,
    isBridge: false,
    x: 220,
    y: 250,
    recentTopics: ['Public Transport Strike & Fare Revision'],
    activityVolume: 530,
    avatarColor: '#2563EB',
    firstSeenTimestamp: new Date(REF_MS - 18 * MS_PER_DAY).toISOString(),
    lastActiveTimestamp: new Date(REF_MS - 3.5 * MS_PER_HOUR).toISOString(),
    coordinatesByHorizon: {
      '24h': { x: 220, y: 250 },
      '7d': { x: 220, y: 250 },
      '30d': { x: 210, y: 240 },
    }
  }
];

export const MOCK_NETWORK_EDGES: TimedNetworkEdge[] = [
  // --- TELEGRAM EDGES ---
  {
    id: 'e-tg-1',
    source: 'node-tg-04',
    target: 'node-tg-02',
    weight: 4.8,
    interactionType: 'repost',
    platform: 'telegram',
    timestamp: new Date(REF_MS - 2 * MS_PER_HOUR).toISOString(),
  },
  {
    id: 'e-tg-2',
    source: 'node-tg-02',
    target: 'node-tg-01',
    weight: 4.2,
    interactionType: 'reply',
    platform: 'telegram',
    timestamp: new Date(REF_MS - 2.5 * MS_PER_HOUR).toISOString(),
  },
  {
    id: 'e-tg-3',
    source: 'node-tg-01',
    target: 'node-tg-03',
    weight: 4.6,
    interactionType: 'mention',
    platform: 'telegram',
    timestamp: new Date(REF_MS - 3.2 * MS_PER_HOUR).toISOString(),
  },
  {
    id: 'e-tg-4',
    source: 'node-tg-02',
    target: 'node-tg-05',
    weight: 5.1,
    interactionType: 'quote',
    platform: 'telegram',
    timestamp: new Date(REF_MS - 1.8 * MS_PER_HOUR).toISOString(),
  },
  {
    id: 'e-tg-5',
    source: 'node-tg-05',
    target: 'node-tg-01',
    weight: 3.8,
    interactionType: 'reply',
    platform: 'telegram',
    timestamp: new Date(REF_MS - 4.1 * MS_PER_HOUR).toISOString(),
  },
  {
    id: 'e-tg-6',
    source: 'node-tg-02',
    target: 'node-tg-06',
    weight: 2.8,
    interactionType: 'reply',
    platform: 'telegram',
    timestamp: new Date(REF_MS - 2.5 * MS_PER_DAY).toISOString(),
  },

  // --- X EDGES ---
  {
    id: 'e-x-1',
    source: 'node-x-01',
    target: 'node-x-03',
    weight: 5.2,
    interactionType: 'repost',
    platform: 'x',
    timestamp: new Date(REF_MS - 1.5 * MS_PER_HOUR).toISOString(),
  },
  {
    id: 'e-x-2',
    source: 'node-x-03',
    target: 'node-x-02',
    weight: 4.9,
    interactionType: 'quote',
    platform: 'x',
    timestamp: new Date(REF_MS - 2.2 * MS_PER_HOUR).toISOString(),
  },
  {
    id: 'e-x-3',
    source: 'node-x-03',
    target: 'node-x-04',
    weight: 4.1,
    interactionType: 'reply',
    platform: 'x',
    timestamp: new Date(REF_MS - 6.5 * MS_PER_HOUR).toISOString(),
  },
  {
    id: 'e-x-4',
    source: 'node-x-01',
    target: 'node-x-05',
    weight: 3.4,
    interactionType: 'mention',
    platform: 'x',
    timestamp: new Date(REF_MS - 3.8 * MS_PER_DAY).toISOString(),
  },
  {
    id: 'e-x-5',
    source: 'node-x-03',
    target: 'node-x-06',
    weight: 3.6,
    interactionType: 'reply',
    platform: 'x',
    timestamp: new Date(REF_MS - 2.1 * MS_PER_DAY).toISOString(),
  },

  // --- REDDIT EDGES ---
  {
    id: 'e-rd-1',
    source: 'node-rd-03',
    target: 'node-rd-02',
    weight: 4.5,
    interactionType: 'reply',
    platform: 'reddit',
    timestamp: new Date(REF_MS - 2.1 * MS_PER_HOUR).toISOString(),
  },
  {
    id: 'e-rd-2',
    source: 'node-rd-02',
    target: 'node-rd-04',
    weight: 4.8,
    interactionType: 'quote',
    platform: 'reddit',
    timestamp: new Date(REF_MS - 3.4 * MS_PER_HOUR).toISOString(),
  },
  {
    id: 'e-rd-3',
    source: 'node-rd-02',
    target: 'node-rd-05',
    weight: 3.9,
    interactionType: 'repost',
    platform: 'reddit',
    timestamp: new Date(REF_MS - 4.2 * MS_PER_HOUR).toISOString(),
  },
  {
    id: 'e-rd-4',
    source: 'node-rd-01',
    target: 'node-rd-02',
    weight: 3.5,
    interactionType: 'reply',
    platform: 'reddit',
    timestamp: new Date(REF_MS - 1.8 * MS_PER_DAY).toISOString(),
  },

  // --- YOUTUBE EDGES ---
  {
    id: 'e-yt-1',
    source: 'node-yt-05',
    target: 'node-yt-04',
    weight: 4.7,
    interactionType: 'mention',
    platform: 'youtube',
    timestamp: new Date(REF_MS - 2.8 * MS_PER_HOUR).toISOString(),
  },
  {
    id: 'e-yt-2',
    source: 'node-yt-04',
    target: 'node-yt-01',
    weight: 4.3,
    interactionType: 'quote',
    platform: 'youtube',
    timestamp: new Date(REF_MS - 3.1 * MS_PER_HOUR).toISOString(),
  },
  {
    id: 'e-yt-3',
    source: 'node-yt-01',
    target: 'node-yt-03',
    weight: 3.6,
    interactionType: 'reply',
    platform: 'youtube',
    timestamp: new Date(REF_MS - 4.5 * MS_PER_DAY).toISOString(),
  },
  {
    id: 'e-yt-4',
    source: 'node-yt-04',
    target: 'node-yt-02',
    weight: 3.2,
    interactionType: 'repost',
    platform: 'youtube',
    timestamp: new Date(REF_MS - 3.8 * MS_PER_DAY).toISOString(),
  },

  // --- CROSS-PLATFORM INTER-LINK EDGES (Active when 'all' platforms selected) ---
  {
    id: 'e-cross-1',
    source: 'node-x-01',
    target: 'node-tg-02',
    weight: 4.4,
    interactionType: 'repost',
    timestamp: new Date(REF_MS - 2.4 * MS_PER_HOUR).toISOString(),
  },
  {
    id: 'e-cross-2',
    source: 'node-tg-02',
    target: 'node-rd-02',
    weight: 4.0,
    interactionType: 'quote',
    timestamp: new Date(REF_MS - 3.5 * MS_PER_HOUR).toISOString(),
  },
  {
    id: 'e-cross-3',
    source: 'node-x-03',
    target: 'node-yt-04',
    weight: 4.6,
    interactionType: 'repost',
    timestamp: new Date(REF_MS - 2.9 * MS_PER_HOUR).toISOString(),
  },
  {
    id: 'e-cross-4',
    source: 'node-rd-01',
    target: 'node-yt-01',
    weight: 3.8,
    interactionType: 'reply',
    timestamp: new Date(REF_MS - 2.2 * MS_PER_DAY).toISOString(),
  }
];

export interface NetworkDatasetResult {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  communities: NetworkCommunity[];
  summary: {
    activeCommunities: number;
    monitoredNodes: number;
    interactionLinks: number;
    bridgeNodes: number;
  };
}

/**
 * Filter the centralized network dataset by daysBack horizon AND platformFilter.
 * If a specific platform is selected (e.g. 'telegram'), nodes/groups/edges not
 * on that platform are completely excluded.
 */
export function filterNetworkByDaysBack(
  daysBack: number,
  platformFilter: Platform = 'all'
): NetworkDatasetResult {
  const cutoffTime = REF_MS - daysBack * MS_PER_DAY;

  // 1. Filter nodes by platform first
  let platformEligibleNodes = MOCK_NETWORK_NODES;
  if (platformFilter !== 'all') {
    platformEligibleNodes = MOCK_NETWORK_NODES.filter(
      (n) => n.platform === platformFilter || (n.platforms && n.platforms.includes(platformFilter))
    );
  }

  const eligibleNodeIdSet = new Set(platformEligibleNodes.map((n) => n.id));

  // 2. Filter edges: must fall within time horizon AND connect eligible platform nodes
  const activeEdges = MOCK_NETWORK_EDGES.filter((edge) => {
    const edgeTime = Date.parse(edge.timestamp);
    if (edgeTime < cutoffTime) return false;
    
    // If specific platform, edge must belong to that platform or connect two nodes of that platform
    if (platformFilter !== 'all') {
      if (edge.platform && edge.platform !== platformFilter) return false;
      if (!eligibleNodeIdSet.has(edge.source) || !eligibleNodeIdSet.has(edge.target)) return false;
    }
    return eligibleNodeIdSet.has(edge.source) && eligibleNodeIdSet.has(edge.target);
  });

  // 3. Collect node IDs that participate in active edges
  const activeNodeIdSet = new Set<string>();
  activeEdges.forEach((e) => {
    activeNodeIdSet.add(e.source);
    activeNodeIdSet.add(e.target);
  });

  // Horizon label key for coordinate interpolation
  const horizonKey: '24h' | '7d' | '30d' =
    daysBack <= 1.5 ? '24h' : daysBack <= 8 ? '7d' : '30d';

  // 4. Return nodes that are active in this time horizon on this platform
  const activeNodes: NetworkNode[] = platformEligibleNodes.filter((n) => {
    const lastActive = Date.parse(n.lastActiveTimestamp);
    return activeNodeIdSet.has(n.id) || lastActive >= cutoffTime;
  }).map((node) => {
    const connectionsCount = activeEdges.filter(
      (e) => e.source === node.id || e.target === node.id
    ).length;

    const coords = node.coordinatesByHorizon[horizonKey] || { x: node.x, y: node.y };

    return {
      id: node.id,
      label: node.label,
      alias: node.alias,
      communityId: node.communityId,
      communityName: node.communityName,
      role: node.role,
      platform: node.platform,
      platforms: node.platforms,
      pagerank: node.pagerank,
      betweenness: node.betweenness,
      connectionsCount: Math.max(connectionsCount, 1),
      isBridge: node.isBridge,
      x: coords.x,
      y: coords.y,
      recentTopics: node.recentTopics,
      activityVolume: node.activityVolume,
      avatarColor: node.avatarColor,
    };
  });

  // 5. Communities that have active members in this platform/window
  const activeCommunityIds = new Set(activeNodes.map((n) => n.communityId));
  const activeCommunities = MOCK_COMMUNITIES.filter((c) =>
    activeCommunityIds.has(c.id)
  ).map((c) => ({
    ...c,
    nodeCount: activeNodes.filter((n) => n.communityId === c.id).length,
  }));

  const bridgeCount = activeNodes.filter((n) => n.isBridge).length;

  return {
    nodes: activeNodes,
    edges: activeEdges,
    communities: activeCommunities,
    summary: {
      activeCommunities: activeCommunities.length,
      monitoredNodes: activeNodes.length,
      interactionLinks: activeEdges.length,
      bridgeNodes: bridgeCount,
    }
  };
}
