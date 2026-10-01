import {
  Platform as PrismaPlatform,
  SentimentType as PrismaSentiment,
  Prisma,
} from '@prisma/client';
import { prisma } from '../db/prisma';
import { parseTimeFilter, mapPlatformFilter } from './overviewService';

export interface NetworkQueryParams {
  timeRange?: string;
  timeFilter?: string;
  daysBack?: number | string;
  platform?: string;
  platformFilter?: string;
}

export interface NetworkNodeResult {
  id: string;
  label: string;
  alias: string;
  communityId: string;
  communityName: string;
  role: string;
  platform: 'all' | 'x' | 'telegram' | 'reddit' | 'youtube';
  platforms?: ('x' | 'telegram' | 'reddit' | 'youtube')[];
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

export interface NetworkEdgeResult {
  id: string;
  source: string;
  target: string;
  weight: number;
  interactionType: 'reply' | 'repost' | 'mention' | 'quote';
  platform?: 'x' | 'telegram' | 'reddit' | 'youtube';
}

export interface NetworkCommunityResult {
  id: string;
  name: string;
  color: string;
  nodeCount: number;
  dominantSentiment: 'positive' | 'neutral' | 'negative';
  description: string;
}

export interface NetworkSummaryResult {
  activeCommunities: number;
  monitoredNodes: number;
  interactionLinks: number;
  bridgeNodes: number;
}

export interface NetworkDatasetResult {
  nodes: NetworkNodeResult[];
  edges: NetworkEdgeResult[];
  communities: NetworkCommunityResult[];
  summary: NetworkSummaryResult;
}

/**
 * Deterministic Community Cluster Centers on 800x520 Canvas
 */
const COMMUNITY_CENTERS: Record<string, { x: number; y: number }> = {
  'comm-1': { x: 260, y: 190 }, // Transit & Commuter Groups (North-West)
  'comm_01': { x: 260, y: 190 },
  'comm-2': { x: 540, y: 180 }, // Municipal & Operator Councils (North-East)
  'comm_02': { x: 540, y: 180 },
  'comm-3': { x: 260, y: 370 }, // Civic & Policy Watchdogs (South-West)
  'comm_03': { x: 260, y: 370 },
  'comm-4': { x: 540, y: 360 }, // Media & Dispatch Outlets (South-East)
  'comm_04': { x: 540, y: 360 },
};

const DEFAULT_CENTER = { x: 400, y: 260 };

export class NetworkService {
  /**
   * Main network graph computation over filtered Supabase PostgreSQL dataset
   */
  async getNetwork(params: NetworkQueryParams): Promise<NetworkDatasetResult> {
    const rawPlatform = params.platform || params.platformFilter;
    const { daysBack } = parseTimeFilter(params.timeRange, params.timeFilter, params.daysBack);
    const platformFilter = mapPlatformFilter(rawPlatform);

    // Reference time: use latest edge or latest post
    const latestEdge = await prisma.networkEdge.findFirst({
      orderBy: { occurredAt: 'desc' },
      select: { occurredAt: true },
    });
    const refDate = latestEdge ? latestEdge.occurredAt : new Date();
    const sinceDate = new Date(refDate.getTime() - daysBack * 86400 * 1000);

    // 1. Fetch filtered NetworkEdges
    const edgeWhere: Prisma.NetworkEdgeWhereInput = {
      occurredAt: { gte: sinceDate },
    };
    if (platformFilter) {
      edgeWhere.platform = platformFilter;
    }

    const rawEdges = await prisma.networkEdge.findMany({
      where: edgeWhere,
      orderBy: { occurredAt: 'desc' },
    });

    if (rawEdges.length === 0) {
      return {
        nodes: [],
        edges: [],
        communities: [],
        summary: {
          activeCommunities: 0,
          monitoredNodes: 0,
          interactionLinks: 0,
          bridgeNodes: 0,
        },
      };
    }

    // 2. Identify distinct participating user IDs
    const userIdsSet = new Set<string>();
    rawEdges.forEach((e) => {
      userIdsSet.add(e.sourceUserId);
      userIdsSet.add(e.targetUserId);
    });

    const userIds = Array.from(userIdsSet);

    // 3. Fetch participating User entities with Community and Posts
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      include: {
        community: true,
        posts: {
          where: { createdAt: { gte: sinceDate } },
          include: { topic: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    const userMap = new Map<string, typeof users[0]>();
    users.forEach((u) => userMap.set(u.id, u));

    // 4. Build adjacency lists for graph algorithms
    // Adjacency for directed graph: u -> array of { v, weight }
    const outAdj = new Map<string, { target: string; weight: number }[]>();
    const inAdj = new Map<string, { source: string; weight: number }[]>();
    const undirectedAdj = new Map<string, Set<string>>();

    userIds.forEach((id) => {
      outAdj.set(id, []);
      inAdj.set(id, []);
      undirectedAdj.set(id, new Set());
    });

    rawEdges.forEach((e) => {
      if (outAdj.has(e.sourceUserId) && inAdj.has(e.targetUserId)) {
        outAdj.get(e.sourceUserId)!.push({ target: e.targetUserId, weight: e.weight });
        inAdj.get(e.targetUserId)!.push({ source: e.sourceUserId, weight: e.weight });
        undirectedAdj.get(e.sourceUserId)!.add(e.targetUserId);
        undirectedAdj.get(e.targetUserId)!.add(e.sourceUserId);
      }
    });

    // 5. Calculate PageRank (Damping factor d = 0.85, max 40 iterations)
    const pagerankScores = this.calculatePageRank(userIds, outAdj);

    // 6. Calculate Betweenness Centrality (Brandes' Algorithm on directed graph)
    const betweennessScores = this.calculateBetweenness(userIds, outAdj);

    // 7. Community Analysis & Cross-Community Connections
    const crossCommunityEdgesCountByNode = new Map<string, number>();
    const externalCommunitiesConnectedByNode = new Map<string, Set<string>>();

    userIds.forEach((id) => {
      crossCommunityEdgesCountByNode.set(id, 0);
      externalCommunitiesConnectedByNode.set(id, new Set());
    });

    rawEdges.forEach((e) => {
      const srcUser = userMap.get(e.sourceUserId);
      const tgtUser = userMap.get(e.targetUserId);

      if (srcUser && tgtUser && srcUser.communityId && tgtUser.communityId && srcUser.communityId !== tgtUser.communityId) {
        crossCommunityEdgesCountByNode.set(
          e.sourceUserId,
          (crossCommunityEdgesCountByNode.get(e.sourceUserId) || 0) + 1
        );
        crossCommunityEdgesCountByNode.set(
          e.targetUserId,
          (crossCommunityEdgesCountByNode.get(e.targetUserId) || 0) + 1
        );

        externalCommunitiesConnectedByNode.get(e.sourceUserId)?.add(tgtUser.communityId);
        externalCommunitiesConnectedByNode.get(e.targetUserId)?.add(srcUser.communityId);
      }
    });

    // 8. Bridge Node Detection Rule:
    // A node is a structural bridge if:
    // - It has cross-community connections (connects to >= 1 external community)
    // - AND its betweenness centrality is strictly > 0.04 (or above 70th percentile of active nodes)
    const activeBetweennessVals = Array.from(betweennessScores.values()).filter((v) => v > 0);
    activeBetweennessVals.sort((a, b) => a - b);
    const p70Betweenness = activeBetweennessVals.length > 0
      ? activeBetweennessVals[Math.floor(activeBetweennessVals.length * 0.65)]
      : 0.05;

    const bridgeThreshold = Math.max(0.04, p70Betweenness);

    // 9. Construct NetworkNodes with Deterministic Coordinates
    // Group users by community to layout clusters cleanly
    const communityUserGroups = new Map<string, string[]>();
    userIds.forEach((id) => {
      const u = userMap.get(id);
      const cId = u?.community?.slug || u?.communityId || 'general';
      if (!communityUserGroups.has(cId)) communityUserGroups.set(cId, []);
      communityUserGroups.get(cId)!.push(id);
    });

    const nodePositions = new Map<string, { x: number; y: number }>();

    communityUserGroups.forEach((groupUserIds, cId) => {
      const center = COMMUNITY_CENTERS[cId] || DEFAULT_CENTER;
      // Sort within cluster by PageRank descending so key nodes sit centrally
      groupUserIds.sort((a, b) => (pagerankScores.get(b) || 0) - (pagerankScores.get(a) || 0));

      groupUserIds.forEach((id, index) => {
        const isBridge =
          (crossCommunityEdgesCountByNode.get(id) || 0) > 0 &&
          (betweennessScores.get(id) || 0) >= bridgeThreshold;

        if (isBridge) {
          // Pull bridge node toward canvas center between its communities
          const extCommSet = externalCommunitiesConnectedByNode.get(id);
          let targetX = center.x;
          let targetY = center.y;
          let count = 1;

          if (extCommSet) {
            extCommSet.forEach((extCId) => {
              const extCenter = COMMUNITY_CENTERS[extCId];
              if (extCenter) {
                targetX += extCenter.x;
                targetY += extCenter.y;
                count++;
              }
            });
          }

          const avgX = targetX / count;
          const avgY = targetY / count;
          // Interpolate towards multi-community midpoint with deterministic spacing offset
          const angle = index * 2.399963;
          const offsetRadius = 14 + (index % 5) * 8;
          const midX = Math.round(center.x * 0.4 + avgX * 0.6);
          const midY = Math.round(center.y * 0.4 + avgY * 0.6);
          const bridgeX = Math.round(midX + offsetRadius * Math.cos(angle));
          const bridgeY = Math.round(midY + offsetRadius * Math.sin(angle));
          nodePositions.set(id, { x: bridgeX, y: bridgeY });
        } else {
          // Concentric spiral / golden angle deterministic placement around community center
          const angle = index * 2.399963; // Golden angle in radians
          const radius = 22 + Math.sqrt(index) * 18;
          const px = Math.round(center.x + radius * Math.cos(angle));
          const py = Math.round(center.y + radius * Math.sin(angle));
          nodePositions.set(id, { x: px, y: py });
        }
      });
    });

    const nodes: NetworkNodeResult[] = users.map((u) => {
      const degree = undirectedAdj.get(u.id)?.size || 0;
      const incidentEdgesCount = (outAdj.get(u.id)?.length || 0) + (inAdj.get(u.id)?.length || 0);
      const connectionsCount = Math.max(degree, incidentEdgesCount);
      const pagerank = parseFloat((pagerankScores.get(u.id) || 0).toFixed(3));
      const betweenness = parseFloat((betweennessScores.get(u.id) || 0).toFixed(3));

      const isBridge =
        (crossCommunityEdgesCountByNode.get(u.id) || 0) > 0 &&
        betweenness >= bridgeThreshold;

      const pos = nodePositions.get(u.id) || DEFAULT_CENTER;

      // Extract recent topics from user's posts
      const topicSet = new Set<string>();
      u.posts.forEach((p) => {
        if (p.topic?.name) topicSet.add(p.topic.name);
      });
      const recentTopics = Array.from(topicSet).slice(0, 3);

      // Activity volume derived from user posts & engagements
      let activityVolume = u.posts.length * 25;
      u.posts.forEach((p) => {
        activityVolume += p.likesCount + p.repostsCount * 2 + p.commentsCount * 3;
      });
      if (activityVolume === 0) activityVolume = 120 + Math.round(connectionsCount * 35);

      const cSlug = u.community?.slug || u.communityId || 'comm-1';
      const cName = u.community?.name || 'General Community';
      const role = u.role || (isBridge ? 'Structural Bridge Node' : 'Community Participant');

      return {
        id: u.id,
        label: u.handle,
        alias: u.alias || u.displayName,
        communityId: cSlug,
        communityName: cName,
        role,
        platform: u.platform.toLowerCase() as 'x' | 'telegram' | 'reddit' | 'youtube',
        pagerank,
        betweenness,
        connectionsCount,
        isBridge,
        x: pos.x,
        y: pos.y,
        recentTopics,
        activityVolume,
        avatarColor: u.avatarColor || u.community?.color || '#2563EB',
      };
    });

    // Sort nodes by PageRank descending
    nodes.sort((a, b) => b.pagerank - a.pagerank);

    // 10. Map NetworkEdges to frontend contract
    const edges: NetworkEdgeResult[] = rawEdges.map((e) => {
      let interactionType: 'reply' | 'repost' | 'mention' | 'quote' = 'mention';
      const typeStr = e.interactionType.toLowerCase();
      if (typeStr === 'reply') interactionType = 'reply';
      else if (typeStr === 'repost' || typeStr === 'share') interactionType = 'repost';
      else if (typeStr === 'quote') interactionType = 'quote';

      return {
        id: e.id,
        source: e.sourceUserId,
        target: e.targetUserId,
        weight: e.weight,
        interactionType,
        platform: e.platform.toLowerCase() as 'x' | 'telegram' | 'reddit' | 'youtube',
      };
    });

    // 11. Communities summary from active nodes
    const communityIdToNodes = new Map<string, NetworkNodeResult[]>();
    nodes.forEach((n) => {
      if (!communityIdToNodes.has(n.communityId)) {
        communityIdToNodes.set(n.communityId, []);
      }
      communityIdToNodes.get(n.communityId)!.push(n);
    });

    const dbCommunities = await prisma.community.findMany();
    const communities: NetworkCommunityResult[] = dbCommunities
      .filter((c) => communityIdToNodes.has(c.slug) || communityIdToNodes.has(c.id))
      .map((c) => {
        const cKey = communityIdToNodes.has(c.slug) ? c.slug : c.id;
        const cNodes = communityIdToNodes.get(cKey) || [];

        // Determine community dominant sentiment from active members' posts
        let pos = 0,
          neu = 0,
          neg = 0;
        cNodes.forEach((node) => {
          const userEntity = userMap.get(node.id);
          userEntity?.posts.forEach((p) => {
            if (p.sentiment === PrismaSentiment.POSITIVE) pos++;
            else if (p.sentiment === PrismaSentiment.NEUTRAL) neu++;
            else if (p.sentiment === PrismaSentiment.NEGATIVE) neg++;
          });
        });

        let dominantSentiment: 'positive' | 'neutral' | 'negative' = 'negative';
        if (pos > neg && pos > neu) dominantSentiment = 'positive';
        else if (neu >= pos && neu >= neg) dominantSentiment = 'neutral';

        return {
          id: c.slug,
          name: c.name,
          color: c.color,
          nodeCount: cNodes.length,
          dominantSentiment,
          description: c.description,
        };
      });

    const bridgeCount = nodes.filter((n) => n.isBridge).length;

    return {
      nodes,
      edges,
      communities,
      summary: {
        activeCommunities: communities.length,
        monitoredNodes: nodes.length,
        interactionLinks: edges.length,
        bridgeNodes: bridgeCount,
      },
    };
  }

  /**
   * Helper to compute bridge node count for OverviewService without duplicate code
   */
  async getBridgeNodesCount(params: NetworkQueryParams): Promise<number> {
    const dataset = await this.getNetwork(params);
    return dataset.summary.bridgeNodes = dataset.nodes.filter((n) => n.isBridge).length;
  }

  /**
   * PageRank Algorithm Implementation (Iterative Power Method)
   * - Graph: Directed weighted graph
   * - Damping Factor: d = 0.85
   * - Convergence: max 40 iterations or delta < 1e-5
   */
  private calculatePageRank(
    nodes: string[],
    outAdj: Map<string, { target: string; weight: number }[]>
  ): Map<string, number> {
    const N = nodes.length;
    const scores = new Map<string, number>();

    if (N === 0) return scores;
    if (N === 1) {
      scores.set(nodes[0], 1.0);
      return scores;
    }

    const d = 0.85;
    const initialRank = 1.0 / N;
    nodes.forEach((id) => scores.set(id, initialRank));

    // Precalculate out-weights sum
    const outWeightSum = new Map<string, number>();
    nodes.forEach((id) => {
      const edges = outAdj.get(id) || [];
      const sum = edges.reduce((acc, e) => acc + e.weight, 0);
      outWeightSum.set(id, sum);
    });

    for (let iter = 0; iter < 40; iter++) {
      const newScores = new Map<string, number>();
      nodes.forEach((id) => newScores.set(id, (1 - d) / N));

      // Calculate dangling sum (nodes with 0 outgoing weight)
      let danglingSum = 0;
      nodes.forEach((id) => {
        const sum = outWeightSum.get(id) || 0;
        if (sum === 0) {
          danglingSum += scores.get(id) || 0;
        }
      });

      const danglingShare = (d * danglingSum) / N;

      // Distribute rank from each node to its targets
      nodes.forEach((src) => {
        const srcRank = scores.get(src) || 0;
        const totalW = outWeightSum.get(src) || 0;
        if (totalW > 0) {
          const targets = outAdj.get(src) || [];
          targets.forEach(({ target, weight }) => {
            const currentTgt = newScores.get(target) || (1 - d) / N;
            newScores.set(target, currentTgt + (d * srcRank * (weight / totalW)));
          });
        }
      });

      // Add dangling share and check convergence
      let maxDelta = 0;
      nodes.forEach((id) => {
        const updated = (newScores.get(id) || 0) + danglingShare;
        const prev = scores.get(id) || 0;
        maxDelta = Math.max(maxDelta, Math.abs(updated - prev));
        newScores.set(id, updated);
      });

      scores.clear();
      newScores.forEach((v, k) => scores.set(k, v));

      if (maxDelta < 1e-5) {
        break;
      }
    }

    return scores;
  }

  /**
   * Betweenness Centrality (Brandes' Algorithm)
   * Computes shortest-path vertex betweenness centrality in O(V * E) time.
   */
  private calculateBetweenness(
    nodes: string[],
    outAdj: Map<string, { target: string; weight: number }[]>
  ): Map<string, number> {
    const betweenness = new Map<string, number>();
    nodes.forEach((id) => betweenness.set(id, 0));

    const N = nodes.length;
    if (N <= 2) return betweenness;

    // For each source node s, run BFS / shortest path
    nodes.forEach((s) => {
      const stack: string[] = [];
      const predecessors = new Map<string, string[]>();
      nodes.forEach((id) => predecessors.set(id, []));

      const sigma = new Map<string, number>();
      nodes.forEach((id) => sigma.set(id, 0));
      sigma.set(s, 1);

      const dist = new Map<string, number>();
      nodes.forEach((id) => dist.set(id, -1));
      dist.set(s, 0);

      const queue: string[] = [s];

      while (queue.length > 0) {
        const v = queue.shift()!;
        stack.push(v);

        const neighbors = outAdj.get(v) || [];
        for (const { target: w } of neighbors) {
          // w found for the first time?
          if (dist.get(w) === -1) {
            dist.set(w, dist.get(v)! + 1);
            queue.push(w);
          }

          // shortest path to w via v?
          if (dist.get(w) === dist.get(v)! + 1) {
            sigma.set(w, sigma.get(w)! + sigma.get(v)!);
            predecessors.get(w)!.push(v);
          }
        }
      }

      // Accumulation: back-propagation of dependencies
      const delta = new Map<string, number>();
      nodes.forEach((id) => delta.set(id, 0));

      while (stack.length > 0) {
        const w = stack.pop()!;
        for (const v of predecessors.get(w)!) {
          const c = (sigma.get(v)! / sigma.get(w)!) * (1 + delta.get(w)!);
          delta.set(v, delta.get(v)! + c);
        }
        if (w !== s) {
          betweenness.set(w, betweenness.get(w)! + delta.get(w)!);
        }
      }
    });

    // Normalization factor for directed graph: 1 / ((N - 1) * (N - 2))
    const normFactor = 1.0 / ((N - 1) * (N - 2));
    nodes.forEach((id) => {
      betweenness.set(id, (betweenness.get(id) || 0) * normFactor);
    });

    return betweenness;
  }
}

export const networkService = new NetworkService();
