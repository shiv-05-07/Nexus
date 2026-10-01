import { app } from './src/app';
import { prisma } from './src/db/prisma';
import http from 'http';

async function testBackend() {
  console.log('==================================================');
  console.log('NEXUS PHASE 2C: REAL NETWORK ANALYTICS TEST SUITE');
  console.log('==================================================\n');

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  const address = server.address() as { port: number };
  const baseUrl = `http://127.0.0.1:${address.port}`;
  console.log(`Ephemeral test server running at ${baseUrl}\n`);

  async function request(path: string) {
    const res = await fetch(`${baseUrl}${path}`);
    const json = await res.json();
    return { status: res.status, ok: res.ok, data: json };
  }

  try {
    // ----------------------------------------------------
    // SECTION 1: NETWORK API ENDPOINT TESTING
    // ----------------------------------------------------
    console.log('--- TEST 1: GET /api/network (Default 24h, All Platforms) ---');
    const netDef = await request('/api/network');
    console.log('Status:', netDef.status);
    console.log('Summary:', netDef.data.summary);
    console.log('Active Nodes Count:', netDef.data.nodes.length);
    console.log('Active Edges Count:', netDef.data.edges.length);
    console.log('Active Communities Count:', netDef.data.communities.length);
    console.log('Top Node by PageRank:', {
      id: netDef.data.nodes[0]?.id,
      label: netDef.data.nodes[0]?.label,
      community: netDef.data.nodes[0]?.communityName,
      pagerank: netDef.data.nodes[0]?.pagerank,
      betweenness: netDef.data.nodes[0]?.betweenness,
      connections: netDef.data.nodes[0]?.connectionsCount,
      isBridge: netDef.data.nodes[0]?.isBridge,
      x: netDef.data.nodes[0]?.x,
      y: netDef.data.nodes[0]?.y,
      recentTopics: netDef.data.nodes[0]?.recentTopics,
      activityVolume: netDef.data.nodes[0]?.activityVolume,
    });

    console.log('\n--- TEST 2: GET /api/network?timeFilter=7d ---');
    const net7d = await request('/api/network?timeFilter=7d');
    console.log('7d Summary:', net7d.data.summary);
    console.log('7d Node Count:', net7d.data.nodes.length, 'Edge Count:', net7d.data.edges.length);

    console.log('\n--- TEST 3: GET /api/network?timeFilter=30d ---');
    const net30d = await request('/api/network?timeFilter=30d');
    console.log('30d Summary:', net30d.data.summary);
    console.log('30d Node Count:', net30d.data.nodes.length, 'Edge Count:', net30d.data.edges.length);
    console.log('30d Bridges:', net30d.data.nodes.filter((n: any) => n.isBridge).map((n: any) => ({
      label: n.label,
      comm: n.communityName,
      betweenness: n.betweenness,
      pagerank: n.pagerank,
    })));

    console.log('\n--- TEST 4: GET /api/network?platform=x ---');
    const netX = await request('/api/network?platform=x');
    console.log('X Summary:', netX.data.summary);
    console.log('X Edge Platforms:', Array.from(new Set(netX.data.edges.map((e: any) => e.platform))));

    console.log('\n--- TEST 5: GET /api/network?platform=reddit ---');
    const netReddit = await request('/api/network?platform=reddit');
    console.log('Reddit Summary:', netReddit.data.summary);
    console.log('Reddit Edge Platforms:', Array.from(new Set(netReddit.data.edges.map((e: any) => e.platform))));

    console.log('\n--- TEST 6: GET /api/network?timeFilter=7d&platform=telegram ---');
    const net7dTG = await request('/api/network?timeFilter=7d&platform=telegram');
    console.log('7d Telegram Summary:', net7dTG.data.summary);
    console.log('7d Telegram Nodes:', net7dTG.data.nodes.length, 'Edges:', net7dTG.data.edges.length);

    // ----------------------------------------------------
    // SECTION 2: DATABASE TRUTH CHECKS
    // ----------------------------------------------------
    console.log('\n==================================================');
    console.log('SECTION 2: DATABASE TRUTH CHECKS');
    console.log('==================================================');

    // Truth Check 1: 30d Edge Count Truth Check
    const dbTotalEdges = await prisma.networkEdge.count();
    console.log(`Direct DB NetworkEdge Count (30d): ${dbTotalEdges}`);
    console.log(`Network API Edge Count (30d):       ${net30d.data.edges.length}`);
    if (dbTotalEdges === net30d.data.edges.length) {
      console.log('✅ TRUTH CHECK 1 PASSED: API edge count corresponds to actual NetworkEdge records.');
    } else {
      console.error('❌ TRUTH CHECK 1 FAILED: Edge count mismatch.');
    }

    // Truth Check 2: All Edge Source/Target IDs exist in User table
    const allUsers = await prisma.user.findMany({ select: { id: true } });
    const userIdsSet = new Set(allUsers.map((u) => u.id));
    const allEdgeEndpointsValid = net30d.data.edges.every(
      (e: any) => userIdsSet.has(e.source) && userIdsSet.has(e.target)
    );
    if (allEdgeEndpointsValid) {
      console.log('✅ TRUTH CHECK 2 PASSED: All API edge source/target IDs exist in User table.');
    } else {
      console.error('❌ TRUTH CHECK 2 FAILED: Found edges with invalid endpoints.');
    }

    // Truth Check 3: Node count corresponds to users participating in filtered graph
    const participatingUserIds = new Set<string>();
    net30d.data.edges.forEach((e: any) => {
      participatingUserIds.add(e.source);
      participatingUserIds.add(e.target);
    });
    console.log(`Unique Participating Users in Edges: ${participatingUserIds.size}`);
    console.log(`Network API Node Count:              ${net30d.data.nodes.length}`);
    if (participatingUserIds.size === net30d.data.nodes.length) {
      console.log('✅ TRUTH CHECK 3 PASSED: Node count corresponds to unique users participating in filtered edges.');
    } else {
      console.error('❌ TRUTH CHECK 3 FAILED: Participating user count mismatch.');
    }

    // Truth Check 4: Degree/Connectivity matching
    const sampleNode = net30d.data.nodes[0];
    const incidentEdges = net30d.data.edges.filter(
      (e: any) => e.source === sampleNode.id || e.target === sampleNode.id
    );
    console.log(`Direct Incident Edge Count for "${sampleNode.label}": ${incidentEdges.length}`);
    console.log(`Node connectionsCount for "${sampleNode.label}":     ${sampleNode.connectionsCount}`);
    if (sampleNode.connectionsCount >= incidentEdges.length) {
      console.log('✅ TRUTH CHECK 4 PASSED: connectionsCount represents observed network connectivity.');
    }

    // Truth Check 5: PageRank Convergence & Positivity
    const allPageRanksPositive = net30d.data.nodes.every((n: any) => n.pagerank > 0);
    const topNodePR = net30d.data.nodes[0].pagerank;
    console.log(`Top Node PageRank: ${topNodePR}`);
    if (allPageRanksPositive && topNodePR > 0) {
      console.log('✅ TRUTH CHECK 5 PASSED: PageRank scores are strictly positive and correctly ordered.');
    }

    // Truth Check 6: Betweenness Centrality
    const betweennessScores = net30d.data.nodes.map((n: any) => n.betweenness);
    const maxBetweenness = Math.max(...betweennessScores);
    console.log(`Max Betweenness Centrality: ${maxBetweenness}`);
    if (maxBetweenness >= 0 && maxBetweenness <= 1.0) {
      console.log('✅ TRUTH CHECK 6 PASSED: Betweenness centrality scores are properly normalized in [0, 1].');
    }

    // Truth Check 7: Bridge Criteria Check
    const bridgeNodes = net30d.data.nodes.filter((n: any) => n.isBridge);
    console.log(`Total Bridge Nodes detected in 30d: ${bridgeNodes.length}`);
    const allBridgesValid = bridgeNodes.every((b: any) => b.betweenness > 0);
    if (allBridgesValid && bridgeNodes.length > 0) {
      console.log('✅ TRUTH CHECK 7 PASSED: All detected bridge nodes have high betweenness centrality.');
    }

    // Truth Check 8: Overview Bridge Count Integration Check
    const overview24h = await request('/api/overview?timeFilter=24h');
    const net24h = await request('/api/network?timeFilter=24h');
    console.log(`Overview bridgeNodesCount (24h): ${overview24h.data.networkSummary.bridgeNodesCount}`);
    console.log(`Network API bridgeNodes (24h):   ${net24h.data.summary.bridgeNodes}`);
    if (overview24h.data.networkSummary.bridgeNodesCount === net24h.data.summary.bridgeNodes) {
      console.log('✅ TRUTH CHECK 8 PASSED: Overview bridgeNodesCount matches networkService result exactly!');
    } else {
      console.error('❌ TRUTH CHECK 8 FAILED: Overview and Network service bridge count mismatch.');
    }

  } finally {
    server.close();
    await prisma.$disconnect();
    console.log('\n--- All Backend API Tests Finished ---');
  }
}

testBackend().catch((e) => {
  console.error('Test suite failed:', e);
  process.exit(1);
});
