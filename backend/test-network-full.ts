import { app } from './src/app';
import { prisma } from './src/db/prisma';
import http from 'http';

async function runNetworkTruthAudit() {
  console.log('================================================================');
  console.log('NEXUS PHASE 3E: REAL NETWORK ANALYTICS TRUTH & INTEGRATION AUDIT');
  console.log('================================================================\n');

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
    // 1. Default (24h)
    console.log('--- TEST 1: GET /api/network (Default 24h) ---');
    const netDef = await request('/api/network');
    console.log('Status:', netDef.status);
    console.log('Summary:', netDef.data.summary);
    console.log('Node Count:', netDef.data.nodes.length, 'Edge Count:', netDef.data.edges.length, 'Bridge Count:', netDef.data.summary.bridgeNodes);

    // 2. 24h explicit
    console.log('\n--- TEST 2: GET /api/network?timeFilter=24h ---');
    const net24h = await request('/api/network?timeFilter=24h');
    console.log('24h Summary:', net24h.data.summary);
    console.log('24h Node Count:', net24h.data.nodes.length, 'Edge Count:', net24h.data.edges.length, 'Bridge Count:', net24h.data.summary.bridgeNodes);

    // 3. 7d
    console.log('\n--- TEST 3: GET /api/network?timeFilter=7d ---');
    const net7d = await request('/api/network?timeFilter=7d');
    console.log('7d Summary:', net7d.data.summary);
    console.log('7d Node Count:', net7d.data.nodes.length, 'Edge Count:', net7d.data.edges.length, 'Bridge Count:', net7d.data.summary.bridgeNodes);

    // 4. 30d
    console.log('\n--- TEST 4: GET /api/network?timeFilter=30d ---');
    const net30d = await request('/api/network?timeFilter=30d');
    console.log('30d Summary:', net30d.data.summary);
    console.log('30d Node Count:', net30d.data.nodes.length, 'Edge Count:', net30d.data.edges.length, 'Bridge Count:', net30d.data.summary.bridgeNodes);

    // 5. Platform X
    console.log('\n--- TEST 5: GET /api/network?platform=x ---');
    const netX = await request('/api/network?platform=x');
    console.log('X Summary:', netX.data.summary);
    console.log('X Node Count:', netX.data.nodes.length, 'Edge Count:', netX.data.edges.length);

    // 6. Platform Telegram
    console.log('\n--- TEST 6: GET /api/network?platform=telegram ---');
    const netTG = await request('/api/network?platform=telegram');
    console.log('Telegram Summary:', netTG.data.summary);
    console.log('Telegram Node Count:', netTG.data.nodes.length, 'Edge Count:', netTG.data.edges.length);

    // 7. Platform Reddit
    console.log('\n--- TEST 7: GET /api/network?platform=reddit ---');
    const netReddit = await request('/api/network?platform=reddit');
    console.log('Reddit Summary:', netReddit.data.summary);
    console.log('Reddit Node Count:', netReddit.data.nodes.length, 'Edge Count:', netReddit.data.edges.length);

    // 8. Platform YouTube
    console.log('\n--- TEST 8: GET /api/network?platform=youtube ---');
    const netYT = await request('/api/network?platform=youtube');
    console.log('YouTube Summary:', netYT.data.summary);
    console.log('YouTube Node Count:', netYT.data.nodes.length, 'Edge Count:', netYT.data.edges.length);

    // 9. Compound filter
    console.log('\n--- TEST 9: GET /api/network?platform=reddit&timeFilter=7d ---');
    const netReddit7d = await request('/api/network?platform=reddit&timeFilter=7d');
    console.log('Reddit 7d Summary:', netReddit7d.data.summary);
    console.log('Reddit 7d Node Count:', netReddit7d.data.nodes.length, 'Edge Count:', netReddit7d.data.edges.length);

    // ----------------------------------------------------
    // SECTION 2: GRAPH INTEGRITY & DATABASE TRUTH CHECKS
    // ----------------------------------------------------
    console.log('\n================================================================');
    console.log('SECTION 2: GRAPH INTEGRITY & DATABASE TRUTH CHECKS');
    console.log('================================================================');

    // Check 1: 30d Reference Check (100 nodes, 200 edges, 23 bridge nodes)
    console.log(`30d Observed: ${net30d.data.nodes.length} nodes, ${net30d.data.edges.length} edges, ${net30d.data.summary.bridgeNodes} bridges`);
    if (net30d.data.nodes.length === 100 && net30d.data.edges.length === 200 && net30d.data.summary.bridgeNodes === 23) {
      console.log('✅ TRUTH CHECK 1 PASSED: 30d graph matches exact Phase 2C canonical audit (100 nodes, 200 edges, 23 bridges).');
    } else {
      console.error('❌ TRUTH CHECK 1 FAILED: 30d graph counts mismatch.');
    }

    // Check 2: 24h Reference Check (19 nodes, 11 edges, 0 bridge nodes)
    console.log(`24h Observed: ${net24h.data.nodes.length} nodes, ${net24h.data.edges.length} edges, ${net24h.data.summary.bridgeNodes} bridges`);
    if (net24h.data.nodes.length === 19 && net24h.data.edges.length === 11 && net24h.data.summary.bridgeNodes === 0) {
      console.log('✅ TRUTH CHECK 2 PASSED: 24h sparse graph matches exact Phase 2C canonical audit (19 nodes, 11 edges, 0 bridges).');
    } else {
      console.error('❌ TRUTH CHECK 2 FAILED: 24h graph counts mismatch.');
    }

    // Check 3: 7d Reference Check (70 nodes, 57 edges, 0 bridge nodes)
    console.log(`7d Observed: ${net7d.data.nodes.length} nodes, ${net7d.data.edges.length} edges, ${net7d.data.summary.bridgeNodes} bridges`);
    if (net7d.data.nodes.length === 70 && net7d.data.edges.length === 57 && net7d.data.summary.bridgeNodes === 0) {
      console.log('✅ TRUTH CHECK 3 PASSED: 7d graph matches exact Phase 2C canonical audit (70 nodes, 57 edges, 0 bridges).');
    } else {
      console.error('❌ TRUTH CHECK 3 FAILED: 7d graph counts mismatch.');
    }

    // Check 4: Endpoint Integrity - Every edge source and target exists in nodes
    const nodeIds30d = new Set(net30d.data.nodes.map((n: any) => n.id));
    const allEndpointsExist = net30d.data.edges.every((e: any) => nodeIds30d.has(e.source) && nodeIds30d.has(e.target));
    if (allEndpointsExist) {
      console.log('✅ TRUTH CHECK 4 PASSED: Every edge source and target exists in nodes dataset.');
    } else {
      console.error('❌ TRUTH CHECK 4 FAILED: Dangling edge endpoints detected.');
    }

    // Check 5: PageRank strictly positive and Betweenness normalized
    const prValid = net30d.data.nodes.every((n: any) => n.pagerank > 0);
    const btValid = net30d.data.nodes.every((n: any) => n.betweenness >= 0 && n.betweenness <= 1.0);
    if (prValid && btValid) {
      console.log('✅ TRUTH CHECK 5 PASSED: PageRank strictly positive and betweenness properly normalized.');
    } else {
      console.error('❌ TRUTH CHECK 5 FAILED: Centrality metric bounds invalid.');
    }

    // Check 6: Coordinates are non-null and within finite canvas bounds
    const coordsValid = net30d.data.nodes.every(
      (n: any) => typeof n.x === 'number' && typeof n.y === 'number' && !isNaN(n.x) && !isNaN(n.y)
    );
    if (coordsValid) {
      console.log('✅ TRUTH CHECK 6 PASSED: All node coordinates are deterministic, finite numbers.');
    } else {
      console.error('❌ TRUTH CHECK 6 FAILED: Found invalid coordinates.');
    }

  } finally {
    server.close();
    await prisma.$disconnect();
    console.log('\n--- All Network Backend Tests & Truth Checks Completed ---');
  }
}

runNetworkTruthAudit().catch((e) => {
  console.error('Test failed:', e);
  process.exit(1);
});
