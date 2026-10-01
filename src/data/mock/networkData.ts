import { NetworkCommunity, NetworkEdge, NetworkNode } from '../../types/nexus';

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
  // Dynamic coordinates per active time horizon for graceful spatial morphing
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
  {
    id: 'node-01',
    label: '@metro_watch',
    alias: 'Metro Transit Wire',
    communityId: 'comm-1',
    communityName: 'Transit & Commuter Groups',
    role: 'Central Commuter Hub',
    pagerank: 0.084,
    betweenness: 0.142,
    connectionsCount: 38,
    isBridge: false,
    x: 220,
    y: 190,
    recentTopics: ['Public Transport Strike & Fare Revision', 'Carpool Inter-City Coordination Protocol'],
    activityVolume: 840,
    avatarColor: '#2563EB',
    firstSeenTimestamp: new Date(REF_MS - 28 * MS_PER_DAY).toISOString(),
    lastActiveTimestamp: new Date(REF_MS - 2 * MS_PER_HOUR).toISOString(),
    coordinatesByHorizon: {
      '24h': { x: 230, y: 210 },
      '7d': { x: 220, y: 190 },
      '30d': { x: 210, y: 180 },
    }
  },
  {
    id: 'node-02',
    label: 'TransitActionHQ',
    alias: 'Union Information Desk',
    communityId: 'comm-2',
    communityName: 'Municipal & Operator Councils',
    role: 'Union Spokesperson',
    pagerank: 0.078,
    betweenness: 0.118,
    connectionsCount: 34,
    isBridge: false,
    x: 480,
    y: 160,
    recentTopics: ['Public Transport Strike & Fare Revision'],
    activityVolume: 720,
    avatarColor: '#7C3AED',
    firstSeenTimestamp: new Date(REF_MS - 25 * MS_PER_DAY).toISOString(),
    lastActiveTimestamp: new Date(REF_MS - 3 * MS_PER_HOUR).toISOString(),
    coordinatesByHorizon: {
      '24h': { x: 490, y: 180 },
      '7d': { x: 480, y: 160 },
      '30d': { x: 460, y: 160 },
    }
  },
  {
    id: 'node-03',
    label: '@urban_pulse_in',
    alias: 'Urban Dispatch Network',
    communityId: 'comm-4',
    communityName: 'Media & Dispatch Outlets',
    role: 'High-Volume News Node',
    pagerank: 0.092,
    betweenness: 0.165,
    connectionsCount: 42,
    isBridge: false,
    x: 620,
    y: 310,
    recentTopics: ['Public Transport Strike & Fare Revision', 'Municipal Cleanliness & Waste Route Overhaul'],
    activityVolume: 1280,
    avatarColor: '#D97706',
    firstSeenTimestamp: new Date(REF_MS - 20 * MS_PER_DAY).toISOString(),
    lastActiveTimestamp: new Date(REF_MS - 2.2 * MS_PER_DAY).toISOString(),
    coordinatesByHorizon: {
      '24h': { x: 620, y: 310 },
      '7d': { x: 620, y: 310 },
      '30d': { x: 630, y: 300 },
    }
  },
  {
    id: 'node-04',
    label: 'u/CivicHealthObserver',
    alias: 'Healthcare Policy Watch',
    communityId: 'comm-3',
    communityName: 'Civic & Policy Watchdogs',
    role: 'Policy Researcher',
    pagerank: 0.058,
    betweenness: 0.082,
    connectionsCount: 22,
    isBridge: false,
    x: 340,
    y: 420,
    recentTopics: ['Emergency Healthcare Ordinance Debate'],
    activityVolume: 410,
    avatarColor: '#0891B2',
    firstSeenTimestamp: new Date(REF_MS - 22 * MS_PER_DAY).toISOString(),
    lastActiveTimestamp: new Date(REF_MS - 3.5 * MS_PER_DAY).toISOString(),
    coordinatesByHorizon: {
      '24h': { x: 340, y: 420 },
      '7d': { x: 340, y: 420 },
      '30d': { x: 330, y: 430 },
    }
  },
  {
    id: 'node-05',
    label: '@commuter_liaison',
    alias: 'Inter-Community Mediator',
    communityId: 'comm-1',
    communityName: 'Transit & Commuter Groups',
    role: 'Structural Bridge Node',
    pagerank: 0.089,
    betweenness: 0.298,
    connectionsCount: 45,
    isBridge: true,
    x: 350,
    y: 250,
    recentTopics: ['Public Transport Strike & Fare Revision', 'Carpool Inter-City Coordination Protocol'],
    activityVolume: 960,
    avatarColor: '#2563EB',
    firstSeenTimestamp: new Date(REF_MS - 26 * MS_PER_DAY).toISOString(),
    lastActiveTimestamp: new Date(REF_MS - 1.5 * MS_PER_HOUR).toISOString(),
    coordinatesByHorizon: {
      '24h': { x: 360, y: 260 },
      '7d': { x: 350, y: 250 },
      '30d': { x: 350, y: 240 },
    }
  },
  {
    id: 'node-06',
    label: 'Ward7CivicForum',
    alias: 'Ward 7 Civic Alliance',
    communityId: 'comm-3',
    communityName: 'Civic & Policy Watchdogs',
    role: 'Local Council Watchdog',
    pagerank: 0.045,
    betweenness: 0.064,
    connectionsCount: 18,
    isBridge: false,
    x: 210,
    y: 380,
    recentTopics: ['Municipal Cleanliness & Waste Route Overhaul'],
    activityVolume: 320,
    avatarColor: '#0891B2',
    firstSeenTimestamp: new Date(REF_MS - 19 * MS_PER_DAY).toISOString(),
    lastActiveTimestamp: new Date(REF_MS - 4.1 * MS_PER_DAY).toISOString(),
    coordinatesByHorizon: {
      '24h': { x: 210, y: 380 },
      '7d': { x: 210, y: 380 },
      '30d': { x: 200, y: 390 },
    }
  },
  {
    id: 'node-07',
    label: 'MetroFleetOps',
    alias: 'Depot Fleet Coordinator',
    communityId: 'comm-2',
    communityName: 'Municipal & Operator Councils',
    role: 'Technical Operations',
    pagerank: 0.052,
    betweenness: 0.076,
    connectionsCount: 24,
    isBridge: false,
    x: 560,
    y: 190,
    recentTopics: ['Public Transport Strike & Fare Revision'],
    activityVolume: 510,
    avatarColor: '#7C3AED',
    firstSeenTimestamp: new Date(REF_MS - 24 * MS_PER_DAY).toISOString(),
    lastActiveTimestamp: new Date(REF_MS - 4 * MS_PER_HOUR).toISOString(),
    coordinatesByHorizon: {
      '24h': { x: 610, y: 210 },
      '7d': { x: 560, y: 190 },
      '30d': { x: 550, y: 180 },
    }
  },
  {
    id: 'node-08',
    label: 'EduReformChannel',
    alias: 'Education Reform Wire',
    communityId: 'comm-4',
    communityName: 'Media & Dispatch Outlets',
    role: 'Specialized Media',
    pagerank: 0.038,
    betweenness: 0.042,
    connectionsCount: 16,
    isBridge: false,
    x: 690,
    y: 390,
    recentTopics: ['Secondary Education Tech Infrastructure Pilot'],
    activityVolume: 290,
    avatarColor: '#D97706',
    firstSeenTimestamp: new Date(REF_MS - 15 * MS_PER_DAY).toISOString(),
    lastActiveTimestamp: new Date(REF_MS - 5.2 * MS_PER_DAY).toISOString(),
    coordinatesByHorizon: {
      '24h': { x: 690, y: 390 },
      '7d': { x: 690, y: 390 },
      '30d': { x: 700, y: 400 },
    }
  },
  {
    id: 'node-09',
    label: '@press_transit_desk',
    alias: 'Senior Transport Correspondent',
    communityId: 'comm-4',
    communityName: 'Media & Dispatch Outlets',
    role: 'Cross-Sector Bridge Node',
    pagerank: 0.095,
    betweenness: 0.312,
    connectionsCount: 48,
    isBridge: true,
    x: 480,
    y: 290,
    recentTopics: ['Public Transport Strike & Fare Revision', 'Surge Pricing Anti-Gouging Petitions'],
    activityVolume: 1140,
    avatarColor: '#D97706',
    firstSeenTimestamp: new Date(REF_MS - 28 * MS_PER_DAY).toISOString(),
    lastActiveTimestamp: new Date(REF_MS - 1.8 * MS_PER_HOUR).toISOString(),
    coordinatesByHorizon: {
      '24h': { x: 480, y: 320 },
      '7d': { x: 480, y: 290 },
      '30d': { x: 470, y: 280 },
    }
  },
  {
    id: 'node-10',
    label: 'RideShareReliefGroup',
    alias: 'Volunteer Carpool Relay',
    communityId: 'comm-1',
    communityName: 'Transit & Commuter Groups',
    role: 'Mutual Aid Facilitator',
    pagerank: 0.061,
    betweenness: 0.095,
    connectionsCount: 26,
    isBridge: false,
    x: 170,
    y: 270,
    recentTopics: ['Carpool Inter-City Coordination Protocol', 'Public Transport Strike & Fare Revision'],
    activityVolume: 580,
    avatarColor: '#2563EB',
    firstSeenTimestamp: new Date(REF_MS - 14 * MS_PER_DAY).toISOString(),
    lastActiveTimestamp: new Date(REF_MS - 3.2 * MS_PER_HOUR).toISOString(),
    coordinatesByHorizon: {
      '24h': { x: 180, y: 290 },
      '7d': { x: 170, y: 270 },
      '30d': { x: 160, y: 260 },
    }
  },
  // Monthly Macro Historical Nodes (Active in 30D horizon)
  {
    id: 'node-11',
    label: '@dept_mobility',
    alias: 'Municipal Logistics Desk',
    communityId: 'comm-2',
    communityName: 'Municipal & Operator Councils',
    role: 'Regulatory Authority',
    pagerank: 0.072,
    betweenness: 0.134,
    connectionsCount: 29,
    isBridge: false,
    x: 570,
    y: 90,
    recentTopics: ['Fare Revision Governance Framework', 'Fleet Operations'],
    activityVolume: 640,
    avatarColor: '#7C3AED',
    firstSeenTimestamp: new Date(REF_MS - 30 * MS_PER_DAY).toISOString(),
    lastActiveTimestamp: new Date(REF_MS - 12 * MS_PER_DAY).toISOString(),
    coordinatesByHorizon: {
      '24h': { x: 570, y: 90 },
      '7d': { x: 570, y: 90 },
      '30d': { x: 570, y: 90 },
    }
  },
  {
    id: 'node-12',
    label: 'u/MetroCommuteUnion',
    alias: 'Regional Labor Council',
    communityId: 'comm-2',
    communityName: 'Municipal & Operator Councils',
    role: 'Organized Labor Federation',
    pagerank: 0.068,
    betweenness: 0.128,
    connectionsCount: 27,
    isBridge: false,
    x: 390,
    y: 90,
    recentTopics: ['Collective Bargaining Agreements', 'Shift Logistics'],
    activityVolume: 580,
    avatarColor: '#7C3AED',
    firstSeenTimestamp: new Date(REF_MS - 29 * MS_PER_DAY).toISOString(),
    lastActiveTimestamp: new Date(REF_MS - 16 * MS_PER_DAY).toISOString(),
    coordinatesByHorizon: {
      '24h': { x: 390, y: 90 },
      '7d': { x: 390, y: 90 },
      '30d': { x: 390, y: 90 },
    }
  },
  {
    id: 'node-13',
    label: 'AuditTransparency',
    alias: 'Public Expenditure Watchdog',
    communityId: 'comm-3',
    communityName: 'Civic & Policy Watchdogs',
    role: 'Civic Ombudsman',
    pagerank: 0.054,
    betweenness: 0.088,
    connectionsCount: 21,
    isBridge: false,
    x: 300,
    y: 490,
    recentTopics: ['Transit Subsidies Audit', 'Infrastructure Transparency'],
    activityVolume: 380,
    avatarColor: '#0891B2',
    firstSeenTimestamp: new Date(REF_MS - 30 * MS_PER_DAY).toISOString(),
    lastActiveTimestamp: new Date(REF_MS - 21 * MS_PER_DAY).toISOString(),
    coordinatesByHorizon: {
      '24h': { x: 300, y: 490 },
      '7d': { x: 300, y: 490 },
      '30d': { x: 300, y: 490 },
    }
  },
  {
    id: 'node-14',
    label: 'StateNewsWire',
    alias: 'National News Wire',
    communityId: 'comm-4',
    communityName: 'Media & Dispatch Outlets',
    role: 'Institutional News',
    pagerank: 0.076,
    betweenness: 0.145,
    connectionsCount: 31,
    isBridge: false,
    x: 750,
    y: 250,
    recentTopics: ['Statewide Transit Directives', 'Economic Impact Reports'],
    activityVolume: 820,
    avatarColor: '#D97706',
    firstSeenTimestamp: new Date(REF_MS - 30 * MS_PER_DAY).toISOString(),
    lastActiveTimestamp: new Date(REF_MS - 24 * MS_PER_DAY).toISOString(),
    coordinatesByHorizon: {
      '24h': { x: 750, y: 250 },
      '7d': { x: 750, y: 250 },
      '30d': { x: 750, y: 250 },
    }
  }
];

export const MOCK_NETWORK_EDGES: TimedNetworkEdge[] = [
  // 1. Core 24-Hour Active Cluster Interactions (Transit Dispute Breaking Core)
  {
    id: 'e1-5',
    source: 'node-01',
    target: 'node-05',
    weight: 4.8,
    interactionType: 'repost',
    timestamp: new Date(REF_MS - 2.5 * MS_PER_HOUR).toISOString(),
  },
  {
    id: 'e5-2',
    source: 'node-05',
    target: 'node-02',
    weight: 4.2,
    interactionType: 'reply',
    timestamp: new Date(REF_MS - 4.1 * MS_PER_HOUR).toISOString(),
  },
  {
    id: 'e2-7',
    source: 'node-02',
    target: 'node-07',
    weight: 4.5,
    interactionType: 'mention',
    timestamp: new Date(REF_MS - 5.8 * MS_PER_HOUR).toISOString(),
  },
  {
    id: 'e5-9',
    source: 'node-05',
    target: 'node-09',
    weight: 5.2,
    interactionType: 'quote',
    timestamp: new Date(REF_MS - 3.2 * MS_PER_HOUR).toISOString(),
  },
  {
    id: 'e9-2',
    source: 'node-09',
    target: 'node-02',
    weight: 3.9,
    interactionType: 'reply',
    timestamp: new Date(REF_MS - 6.4 * MS_PER_HOUR).toISOString(),
  },
  {
    id: 'e1-10',
    source: 'node-01',
    target: 'node-10',
    weight: 3.7,
    interactionType: 'repost',
    timestamp: new Date(REF_MS - 7.5 * MS_PER_HOUR).toISOString(),
  },
  {
    id: 'e10-5',
    source: 'node-10',
    target: 'node-05',
    weight: 3.2,
    interactionType: 'mention',
    timestamp: new Date(REF_MS - 11.2 * MS_PER_HOUR).toISOString(),
  },

  // 2. 7-Day Weekly Cross-Sector Links (Civic & Media Expansion)
  {
    id: 'e9-3',
    source: 'node-09',
    target: 'node-03',
    weight: 4.8,
    interactionType: 'repost',
    timestamp: new Date(REF_MS - 1.9 * MS_PER_DAY).toISOString(),
  },
  {
    id: 'e5-4',
    source: 'node-05',
    target: 'node-04',
    weight: 2.6,
    interactionType: 'reply',
    timestamp: new Date(REF_MS - 2.8 * MS_PER_DAY).toISOString(),
  },
  {
    id: 'e4-6',
    source: 'node-04',
    target: 'node-06',
    weight: 3.6,
    interactionType: 'quote',
    timestamp: new Date(REF_MS - 3.6 * MS_PER_DAY).toISOString(),
  },
  {
    id: 'e3-8',
    source: 'node-03',
    target: 'node-08',
    weight: 2.4,
    interactionType: 'mention',
    timestamp: new Date(REF_MS - 4.9 * MS_PER_DAY).toISOString(),
  },
  {
    id: 'e9-4',
    source: 'node-09',
    target: 'node-04',
    weight: 3.1,
    interactionType: 'reply',
    timestamp: new Date(REF_MS - 3.2 * MS_PER_DAY).toISOString(),
  },

  // 3. 30-Day Monthly Macro Institutional Interactions
  {
    id: 'e11-2',
    source: 'node-11',
    target: 'node-02',
    weight: 3.4,
    interactionType: 'mention',
    timestamp: new Date(REF_MS - 12.5 * MS_PER_DAY).toISOString(),
  },
  {
    id: 'e12-11',
    source: 'node-12',
    target: 'node-11',
    weight: 4.1,
    interactionType: 'reply',
    timestamp: new Date(REF_MS - 15.8 * MS_PER_DAY).toISOString(),
  },
  {
    id: 'e13-4',
    source: 'node-13',
    target: 'node-04',
    weight: 2.9,
    interactionType: 'quote',
    timestamp: new Date(REF_MS - 20.4 * MS_PER_DAY).toISOString(),
  },
  {
    id: 'e14-9',
    source: 'node-14',
    target: 'node-09',
    weight: 4.3,
    interactionType: 'repost',
    timestamp: new Date(REF_MS - 23.5 * MS_PER_DAY).toISOString(),
  },
  {
    id: 'e12-5',
    source: 'node-12',
    target: 'node-05',
    weight: 2.7,
    interactionType: 'reply',
    timestamp: new Date(REF_MS - 17.2 * MS_PER_DAY).toISOString(),
  },
  {
    id: 'e1-12',
    source: 'node-01',
    target: 'node-12',
    weight: 2.5,
    interactionType: 'mention',
    timestamp: new Date(REF_MS - 21.0 * MS_PER_DAY).toISOString(),
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
 * Filter the centralized network dataset by daysBack horizon.
 * Designed to mirror backend endpoint: GET /network?days_back={daysBack}
 */
export function filterNetworkByDaysBack(daysBack: number): NetworkDatasetResult {
  const cutoffTime = REF_MS - daysBack * MS_PER_DAY;

  // Filter edges that occurred within the active time horizon
  const activeEdges = MOCK_NETWORK_EDGES.filter((edge) => {
    const edgeTime = Date.parse(edge.timestamp);
    return edgeTime >= cutoffTime;
  });

  // Collect node IDs that participate in active edges
  const activeNodeIdSet = new Set<string>();
  activeEdges.forEach((e) => {
    activeNodeIdSet.add(e.source);
    activeNodeIdSet.add(e.target);
  });

  // Horizon label key for coordinate interpolation
  const horizonKey: '24h' | '7d' | '30d' =
    daysBack <= 1.5 ? '24h' : daysBack <= 8 ? '7d' : '30d';

  // Filter active nodes and recalculate their dynamic connectivity & position
  const activeNodes: NetworkNode[] = MOCK_NETWORK_NODES.filter((n) => {
    const lastActive = Date.parse(n.lastActiveTimestamp);
    return activeNodeIdSet.has(n.id) || lastActive >= cutoffTime;
  }).map((node) => {
    // Dynamically calculate connections count from filtered active edges
    const connectionsCount = activeEdges.filter(
      (e) => e.source === node.id || e.target === node.id
    ).length;

    // Fetch coordinates tailored for this time horizon
    const coords = node.coordinatesByHorizon[horizonKey] || { x: node.x, y: node.y };

    return {
      id: node.id,
      label: node.label,
      alias: node.alias,
      communityId: node.communityId,
      communityName: node.communityName,
      role: node.role,
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

  // Communities that have active members in this window
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
