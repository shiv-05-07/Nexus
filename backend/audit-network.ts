import { app } from './src/app';
import { prisma } from './src/db/prisma';
import http from 'http';

async function runAudit() {
  console.log('==================================================');
  console.log('NEXUS PHASE 2C: TECHNICAL AUDIT SUITE');
  console.log('==================================================\n');

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  const address = server.address() as { port: number };
  const baseUrl = `http://127.0.0.1:${address.port}`;

  async function request(path: string) {
    const start = performance.now();
    const res = await fetch(`${baseUrl}${path}`);
    const json = await res.json();
    const elapsed = performance.now() - start;
    return { status: res.status, ok: res.ok, data: json, elapsed };
  }

  try {
    // ----------------------------------------------------
    // AUDIT ITEM 2: BRIDGE NODE DISTRIBUTION (30d)
    // ----------------------------------------------------
    console.log('>>> AUDIT ITEM 2: BRIDGE NODE DISTRIBUTION (30d)');
    const net30d = await request('/api/network?timeFilter=30d');
    const nodes30d = net30d.data.nodes;
    const edges30d = net30d.data.edges;

    // Load users and communities from database to trace cross-community
    const allUsers = await prisma.user.findMany({ select: { id: true, communityId: true, handle: true } });
    const userCommMap = new Map(allUsers.map((u) => [u.id, u.communityId]));

    // Check cross-community connections per node
    const crossCommCountByNode = new Map<string, number>();
    const extCommsByNode = new Map<string, Set<string>>();
    nodes30d.forEach((n: any) => {
      crossCommCountByNode.set(n.id, 0);
      extCommsByNode.set(n.id, new Set());
    });

    edges30d.forEach((e: any) => {
      const srcComm = userCommMap.get(e.source);
      const tgtComm = userCommMap.get(e.target);
      if (srcComm && tgtComm && srcComm !== tgtComm) {
        crossCommCountByNode.set(e.source, (crossCommCountByNode.get(e.source) || 0) + 1);
        crossCommCountByNode.set(e.target, (crossCommCountByNode.get(e.target) || 0) + 1);
        extCommsByNode.get(e.source)?.add(tgtComm);
        extCommsByNode.get(e.target)?.add(srcComm);
      }
    });

    const nodesWithCrossComm = Array.from(crossCommCountByNode.entries()).filter(([_, count]) => count > 0);
    const nodesWith2PlusExtComms = Array.from(extCommsByNode.entries()).filter(([_, set]) => set.size >= 2);

    const betweennessList: number[] = nodes30d.map((n: any) => n.betweenness).sort((a: number, b: number) => a - b);
    const minBet = betweennessList[0];
    const maxBet = betweennessList[betweennessList.length - 1];
    const medianBet = betweennessList[Math.floor(betweennessList.length * 0.5)];
    const p75Bet = betweennessList[Math.floor(betweennessList.length * 0.75)];
    const p90Bet = betweennessList[Math.floor(betweennessList.length * 0.9)];
    const nodesAbove005 = nodes30d.filter((n: any) => n.betweenness > 0.05).length;
    const finalBridges = nodes30d.filter((n: any) => n.isBridge);

    console.log(`- Total graph nodes (30d): ${nodes30d.length}`);
    console.log(`- Total graph edges (30d): ${edges30d.length}`);
    console.log(`- Nodes with cross-community connections: ${nodesWithCrossComm.length}`);
    console.log(`- Nodes connecting to 2+ external communities: ${nodesWith2PlusExtComms.length}`);
    console.log(`- Betweenness Distribution:`);
    console.log(`  * Minimum: ${minBet}`);
    console.log(`  * Median (P50): ${medianBet}`);
    console.log(`  * 75th Percentile: ${p75Bet}`);
    console.log(`  * 90th Percentile: ${p90Bet}`);
    console.log(`  * Maximum: ${maxBet}`);
    console.log(`- Nodes with betweenness > 0.05: ${nodesAbove005}`);
    console.log(`- Nodes satisfying BOTH bridge conditions: ${finalBridges.length}`);
    console.log(`- Final bridge node count: ${finalBridges.length}\n`);

    // ----------------------------------------------------
    // AUDIT ITEM 3: TIME-FILTER SANITY
    // ----------------------------------------------------
    console.log('>>> AUDIT ITEM 3: TIME-FILTER SANITY (24h, 7d, 30d)');
    const latestEdge = await prisma.networkEdge.findFirst({
      orderBy: { occurredAt: 'desc' },
      select: { occurredAt: true },
    });
    const refDate = latestEdge ? latestEdge.occurredAt : new Date();

    for (const tf of ['24h', '7d', '30d'] as const) {
      const days = tf === '24h' ? 1 : tf === '7d' ? 7 : 30;
      const since = new Date(refDate.getTime() - days * 86400 * 1000);
      const dbEdgeCount = await prisma.networkEdge.count({ where: { occurredAt: { gte: since } } });
      const apiRes = await request(`/api/network?timeFilter=${tf}`);
      const apiEdges = apiRes.data.edges;
      const apiNodes = apiRes.data.nodes;

      const participating = new Set<string>();
      apiEdges.forEach((e: any) => {
        participating.add(e.source);
        participating.add(e.target);
      });

      let crossEdges = 0;
      apiEdges.forEach((e: any) => {
        const sC = userCommMap.get(e.source);
        const tC = userCommMap.get(e.target);
        if (sC && tC && sC !== tC) crossEdges++;
      });

      const bridges = apiNodes.filter((n: any) => n.isBridge).length;

      console.log(`[TimeFilter: ${tf}]`);
      console.log(`  * NetworkEdge DB count: ${dbEdgeCount}`);
      console.log(`  * API edge count: ${apiEdges.length}`);
      console.log(`  * Unique participating users: ${participating.size}`);
      console.log(`  * API node count: ${apiNodes.length}`);
      console.log(`  * Cross-community edge count: ${crossEdges}`);
      console.log(`  * Bridge node count: ${bridges}`);
    }
    console.log();

    // ----------------------------------------------------
    // AUDIT ITEM 4: PLATFORM-FILTER SANITY
    // ----------------------------------------------------
    console.log('>>> AUDIT ITEM 4: PLATFORM-FILTER SANITY (X, Telegram, Reddit, YouTube)');
    for (const p of ['x', 'telegram', 'reddit', 'youtube'] as const) {
      const pUpper = p.toUpperCase() as any;
      const dbEdgeCount = await prisma.networkEdge.count({ where: { platform: pUpper } });
      const apiRes = await request(`/api/network?timeFilter=30d&platform=${p}`);
      const apiEdges = apiRes.data.edges;
      const apiNodes = apiRes.data.nodes;
      const platformsPresent = Array.from(new Set(apiEdges.map((e: any) => e.platform)));
      const topPR = apiNodes[0]?.pagerank;
      const maxBet = apiNodes.length > 0 ? Math.max(...apiNodes.map((n: any) => n.betweenness)) : 0;
      const bridgeCount = apiNodes.filter((n: any) => n.isBridge).length;

      console.log(`[Platform: ${p.toUpperCase()}]`);
      console.log(`  * DB Edge count: ${dbEdgeCount}`);
      console.log(`  * API Edge count: ${apiEdges.length}`);
      console.log(`  * Edge Platforms returned: ${JSON.stringify(platformsPresent)}`);
      console.log(`  * Node Count: ${apiNodes.length}`);
      console.log(`  * Top PageRank: ${topPR}`);
      console.log(`  * Max Betweenness: ${maxBet}`);
      console.log(`  * Bridge Nodes: ${bridgeCount}`);
    }
    console.log();

    // ----------------------------------------------------
    // AUDIT ITEM 5: PAGERANK VERIFICATION
    // ----------------------------------------------------
    console.log('>>> AUDIT ITEM 5: PAGERANK VERIFICATION');
    const prSum30d = nodes30d.reduce((sum: number, n: any) => sum + n.pagerank, 0);
    console.log(`- PageRank Sum (30d): ${prSum30d.toFixed(4)} (Expected approx 1.0)`);
    const allPositive = nodes30d.every((n: any) => n.pagerank > 0);
    console.log(`- All PageRank values strictly positive: ${allPositive}`);

    // Test determinism: call twice
    const prCall1 = await request('/api/network?timeFilter=30d');
    const prCall2 = await request('/api/network?timeFilter=30d');
    const prIdentical = prCall1.data.nodes.every((n: any, i: number) => n.pagerank === prCall2.data.nodes[i].pagerank);
    console.log(`- PageRank deterministic across repeated calls: ${prIdentical}\n`);

    // ----------------------------------------------------
    // AUDIT ITEM 6: DETERMINISTIC LAYOUT VERIFICATION
    // ----------------------------------------------------
    console.log('>>> AUDIT ITEM 6: DETERMINISTIC LAYOUT VERIFICATION');
    const layoutCall1 = await request('/api/network?timeFilter=30d');
    const layoutCall2 = await request('/api/network?timeFilter=30d');
    const coordinatesIdentical = layoutCall1.data.nodes.every(
      (n: any, i: number) => n.x === layoutCall2.data.nodes[i].x && n.y === layoutCall2.data.nodes[i].y
    );
    console.log(`- Coordinates (x, y) identical across repeated calls: ${coordinatesIdentical}`);
    console.log(`- Sample node coords: Node 0 = (${layoutCall1.data.nodes[0].x}, ${layoutCall1.data.nodes[0].y}), Node 1 = (${layoutCall1.data.nodes[1].x}, ${layoutCall1.data.nodes[1].y})\n`);

    // ----------------------------------------------------
    // AUDIT ITEM 7: EDGE CASES
    // ----------------------------------------------------
    console.log('>>> AUDIT ITEM 7: EDGE CASES HANDLING');
    // Case 1: timeFilter for tiny window (e.g. 10m where 0 edges might occur)
    const emptyTimeRes = await request('/api/network?timeFilter=10m');
    console.log(`- 10m window (sparse/empty graph) status: ${emptyTimeRes.status}`);
    console.log(`  * nodes: ${emptyTimeRes.data.nodes.length}, edges: ${emptyTimeRes.data.edges.length}, summary:`, emptyTimeRes.data.summary);

    // Case 2: platform with few edges
    const sparsePlatformRes = await request('/api/network?platform=youtube');
    console.log(`- YouTube platform (sparse) status: ${sparsePlatformRes.status}`);
    console.log(`  * nodes: ${sparsePlatformRes.data.nodes.length}, edges: ${sparsePlatformRes.data.edges.length}\n`);

    // ----------------------------------------------------
    // AUDIT ITEM 8: OVERVIEW CONSISTENCY
    // ----------------------------------------------------
    console.log('>>> AUDIT ITEM 8: OVERVIEW CONSISTENCY');
    for (const tf of ['24h', '7d', '30d'] as const) {
      const ovRes = await request(`/api/overview?timeFilter=${tf}`);
      const netRes = await request(`/api/network?timeFilter=${tf}`);
      const ovBridges = ovRes.data.networkSummary.bridgeNodesCount;
      const netBridges = netRes.data.summary.bridgeNodes;
      const match = ovBridges === netBridges;
      console.log(`- [TimeFilter ${tf}] Overview bridgeNodesCount (${ovBridges}) vs Network bridgeNodes (${netBridges}) -> Match: ${match}`);
    }
    console.log();

    // ----------------------------------------------------
    // AUDIT ITEM 11: PERFORMANCE BENCHMARK
    // ----------------------------------------------------
    console.log('>>> AUDIT ITEM 11: PERFORMANCE BENCHMARK');
    const bench24h = await request('/api/network?timeFilter=24h');
    const bench7d = await request('/api/network?timeFilter=7d');
    const bench30d = await request('/api/network?timeFilter=30d');
    console.log(`- /api/network 24h: ${bench24h.elapsed.toFixed(1)} ms`);
    console.log(`- /api/network 7d:  ${bench7d.elapsed.toFixed(1)} ms`);
    console.log(`- /api/network 30d: ${bench30d.elapsed.toFixed(1)} ms`);

  } finally {
    server.close();
    await prisma.$disconnect();
    console.log('\n--- Network Technical Audit Finished ---');
  }
}

runAudit().catch((e) => {
  console.error('Audit failed:', e);
  process.exit(1);
});
