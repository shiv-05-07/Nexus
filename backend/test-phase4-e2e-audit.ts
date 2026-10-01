import { app } from './src/app';
import { prisma } from './src/db/prisma';
import http from 'http';
import { performance } from 'perf_hooks';

interface AuditResult {
  metric: string;
  prismaVal: any;
  apiVal: any;
  delta: any;
  status: 'MATCH' | 'MISMATCH';
}

async function runPhase4ComprehensiveAudit() {
  console.log('================================================================');
  console.log('NEXUS PHASE 4: COMPREHENSIVE E2E & DATABASE TRUTH AUDIT');
  console.log('================================================================\n');

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  const address = server.address() as { port: number };
  const baseUrl = `http://127.0.0.1:${address.port}`;
  console.log(`Ephemeral test server running at ${baseUrl}\n`);

  async function request(path: string, options: RequestInit = {}) {
    const t0 = performance.now();
    const res = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    const t1 = performance.now();
    const json = await res.json().catch(() => null);
    return { status: res.status, ok: res.ok, data: json, durationMs: Math.round(t1 - t0) };
  }

  const truthResults: AuditResult[] = [];

  function recordTruth(metric: string, prismaVal: any, apiVal: any, customDelta?: any) {
    const delta = customDelta !== undefined ? customDelta : (typeof prismaVal === 'number' && typeof apiVal === 'number' ? apiVal - prismaVal : (prismaVal === apiVal ? 0 : 'N/A'));
    const isMatch = delta === 0 || delta === '0';
    truthResults.push({
      metric,
      prismaVal,
      apiVal,
      delta,
      status: isMatch ? 'MATCH' : 'MISMATCH',
    });
  }

  try {
    // ----------------------------------------------------
    // 1. DATABASE RECONCILIATION: OVERVIEW
    // ----------------------------------------------------
    console.log('--- 1. OVERVIEW DATABASE TRUTH ---');
    const dbTotalPostsAllTime = await prisma.post.count();
    
    // In default 24h window
    const latestPost = await prisma.post.findFirst({ orderBy: { createdAt: 'desc' } });
    const refDate = latestPost ? latestPost.createdAt : new Date();
    const since24h = new Date(refDate.getTime() - 1 * 86400 * 1000);
    const dbPosts24h = await prisma.post.count({ where: { createdAt: { gte: since24h } } });
    const dbTopics24h = (await prisma.post.groupBy({ by: ['topicId'], where: { createdAt: { gte: since24h }, topicId: { not: null } } })).length;
    const dbCommunitiesCount = await prisma.community.count();
    const dbUsersCount = await prisma.user.count();

    const apiOverview = await request('/api/overview?timeFilter=24h');
    recordTruth('Overview: Total Posts (24h)', dbPosts24h, apiOverview.data.metrics.totalPosts);
    recordTruth('Overview: Active Topics (24h)', dbTopics24h, apiOverview.data.metrics.activeTopicsCount);
    recordTruth('Overview: Active Communities', dbCommunitiesCount, apiOverview.data.networkSummary.activeCommunities);
    recordTruth('Overview: Monitored Users', dbUsersCount, apiOverview.data.networkSummary.monitoredNodes);

    // ----------------------------------------------------
    // 2. DATABASE RECONCILIATION: TIMELINE & PAGINATION
    // ----------------------------------------------------
    console.log('--- 2. TIMELINE DATABASE TRUTH & PAGINATION ---');
    const apiTimelineAll = await request('/api/timeline?limit=1000');
    recordTruth('Timeline: All-Time Total Post Count', dbTotalPostsAllTime, apiTimelineAll.data.total);

    // Timeline pagination verification
    const page1 = await request('/api/timeline?limit=10&offset=0');
    const page2 = await request('/api/timeline?limit=10&offset=10');
    const page1Ids = page1.data.items.map((i: any) => i.id);
    const page2Ids = page2.data.items.map((i: any) => i.id);
    const hasOverlap = page1Ids.some((id: string) => page2Ids.includes(id));
    recordTruth('Timeline Pagination: No Overlap Between Page 1 & 2', true, !hasOverlap);
    recordTruth('Timeline Pagination: Page 1 Item Count', 10, page1.data.items.length);
    recordTruth('Timeline Pagination: Page 2 Item Count', 10, page2.data.items.length);

    // Filter by platform=reddit
    const dbRedditPosts = await prisma.post.count({ where: { platform: 'REDDIT' } });
    const apiRedditTimeline = await request('/api/timeline?platform=reddit&limit=1000');
    recordTruth('Timeline: Reddit Posts Total', dbRedditPosts, apiRedditTimeline.data.total);

    // ----------------------------------------------------
    // 3. DATABASE RECONCILIATION: SENTIMENT
    // ----------------------------------------------------
    console.log('--- 3. SENTIMENT DATABASE TRUTH ---');
    const dbSentPos = await prisma.post.count({ where: { createdAt: { gte: since24h }, sentiment: 'POSITIVE' } });
    const dbSentNeu = await prisma.post.count({ where: { createdAt: { gte: since24h }, sentiment: 'NEUTRAL' } });
    const dbSentNeg = await prisma.post.count({ where: { createdAt: { gte: since24h }, sentiment: 'NEGATIVE' } });
    const totalSent24h = dbSentPos + dbSentNeu + dbSentNeg;
    const dbPosPct = Math.round((dbSentPos / totalSent24h) * 100);
    const dbNeuPct = Math.round((dbSentNeu / totalSent24h) * 100);
    const dbNegPct = 100 - dbPosPct - dbNeuPct;

    const apiSentiment = await request('/api/sentiment?timeFilter=24h');
    recordTruth('Sentiment: Positive Pct (24h)', dbPosPct, apiSentiment.data.composition.positive);
    recordTruth('Sentiment: Neutral Pct (24h)', dbNeuPct, apiSentiment.data.composition.neutral);
    recordTruth('Sentiment: Negative Pct (24h)', dbNegPct, apiSentiment.data.composition.negative);
    recordTruth('Sentiment: Total Analyzed (24h)', totalSent24h, apiSentiment.data.composition.totalAnalyzed);

    // ----------------------------------------------------
    // 4. DATABASE RECONCILIATION: TRENDS
    // ----------------------------------------------------
    console.log('--- 4. TRENDS DATABASE TRUTH ---');
    const apiTrends = await request('/api/trends?timeFilter=30d');
    const dbTotalTopicsWithPosts = await prisma.topic.count({ where: { posts: { some: {} } } });
    recordTruth('Trends: Distinct Active Topics Count', dbTotalTopicsWithPosts, apiTrends.data.length);

    // Top trend volume verification
    if (apiTrends.data.length > 0) {
      const topTrend = apiTrends.data[0];
      const dbTopTopicPosts = await prisma.post.count({ where: { topic: { name: topTrend.name } } });
      recordTruth(`Trends: Top Trend (${topTrend.name}) Volume`, dbTopTopicPosts, topTrend.volume);
    }

    // ----------------------------------------------------
    // 5. DATABASE RECONCILIATION: NETWORK
    // ----------------------------------------------------
    console.log('--- 5. NETWORK DATABASE TRUTH ---');
    const dbTotalEdges = await prisma.networkEdge.count();
    const apiNet30d = await request('/api/network?timeFilter=30d');
    recordTruth('Network: Total Edges (30d All-Time)', dbTotalEdges, apiNet30d.data.edges.length);
    recordTruth('Network: Summary Interaction Links (30d)', dbTotalEdges, apiNet30d.data.summary.interactionLinks);
    recordTruth('Network: Active Communities (30d)', dbCommunitiesCount, apiNet30d.data.communities.length);

    // Platform-only network check
    const dbEdgesX = await prisma.networkEdge.count({ where: { platform: 'X' } });
    const apiNetX30d = await request('/api/network?timeFilter=30d&platform=x');
    recordTruth('Network: Platform X Edges (30d)', dbEdgesX, apiNetX30d.data.edges.length);

    const dbEdgesTG = await prisma.networkEdge.count({ where: { platform: 'TELEGRAM' } });
    const apiNetTG30d = await request('/api/network?timeFilter=30d&platform=telegram');
    recordTruth('Network: Platform Telegram Edges (30d)', dbEdgesTG, apiNetTG30d.data.edges.length);

    const dbEdgesReddit = await prisma.networkEdge.count({ where: { platform: 'REDDIT' } });
    const apiNetReddit30d = await request('/api/network?timeFilter=30d&platform=reddit');
    recordTruth('Network: Platform Reddit Edges (30d)', dbEdgesReddit, apiNetReddit30d.data.edges.length);

    const dbEdgesYT = await prisma.networkEdge.count({ where: { platform: 'YOUTUBE' } });
    const apiNetYT30d = await request('/api/network?timeFilter=30d&platform=youtube');
    recordTruth('Network: Platform YouTube Edges (30d)', dbEdgesYT, apiNetYT30d.data.edges.length);

    // ----------------------------------------------------
    // 6. DATABASE RECONCILIATION: AUDIENCE
    // ----------------------------------------------------
    console.log('--- 6. AUDIENCE DATABASE TRUTH ---');
    const dbLanguages = await prisma.post.groupBy({ by: ['language'], _count: true });
    recordTruth('Audience: Primary Language Name', 'English (en)', apiOverview.data.audience.languages[0].language);
    recordTruth('Audience: Primary Language Pct', 100, apiOverview.data.audience.languages[0].percentage);
    recordTruth('Audience: Demographics Unmodeled Array Length', 0, apiOverview.data.audience.ageGroups.length);

    // ----------------------------------------------------
    // 7. PERFORMANCE LATENCIES
    // ----------------------------------------------------
    console.log('\n--- 7. PERFORMANCE BENCHMARKS ---');
    const perfOverview = await request('/api/overview');
    const perfTimeline = await request('/api/timeline?limit=25');
    const perfSentiment = await request('/api/sentiment');
    const perfTrends = await request('/api/trends');
    const perfNetwork = await request('/api/network');
    const perfProfile = await request('/api/profile');

    console.log(`Endpoint Latency:`);
    console.log(`  GET /api/overview:   ${perfOverview.durationMs}ms (HTTP ${perfOverview.status})`);
    console.log(`  GET /api/timeline:   ${perfTimeline.durationMs}ms (HTTP ${perfTimeline.status})`);
    console.log(`  GET /api/sentiment:  ${perfSentiment.durationMs}ms (HTTP ${perfSentiment.status})`);
    console.log(`  GET /api/trends:     ${perfTrends.durationMs}ms (HTTP ${perfTrends.status})`);
    console.log(`  GET /api/network:    ${perfNetwork.durationMs}ms (HTTP ${perfNetwork.status})`);
    console.log(`  GET /api/profile:    ${perfProfile.durationMs}ms (HTTP ${perfProfile.status})`);

    // ----------------------------------------------------
    // 8. RBAC / SECURITY AUDIT
    // ----------------------------------------------------
    console.log('\n--- 8. RBAC & PERMISSION AUDIT ---');
    const rbacTests = [
      { role: 'viewer', action: 'Confirm Signal', endpoint: '/api/signals/confirm', body: { signalId: 'nar-01' }, expectedStatus: 403 },
      { role: 'viewer', action: 'Verify Record', endpoint: '/api/records/verify', body: { recordId: 'post_00001' }, expectedStatus: 403 },
      { role: 'analyst', action: 'Confirm Signal', endpoint: '/api/signals/confirm', body: { signalId: 'nar-01' }, expectedStatus: 200 },
      { role: 'analyst', action: 'Verify Record', endpoint: '/api/records/verify', body: { recordId: 'post_00001' }, expectedStatus: 200 },
      { role: 'lead_analyst', action: 'Confirm Signal', endpoint: '/api/signals/confirm', body: { signalId: 'nar-01' }, expectedStatus: 200 },
      { role: 'lead_analyst', action: 'Verify Record', endpoint: '/api/records/verify', body: { recordId: 'post_00001' }, expectedStatus: 200 },
    ];

    for (const test of rbacTests) {
      const res = await request(test.endpoint, {
        method: 'POST',
        headers: { 'x-user-role': test.role },
        body: JSON.stringify(test.body),
      });
      const passed = res.status === test.expectedStatus;
      console.log(`  [${passed ? 'PASS' : 'FAIL'}] ${test.role.toUpperCase()} -> ${test.action}: Expected ${test.expectedStatus}, Got ${res.status}`);
    }

    console.log('\n================================================================');
    console.log('DATABASE TRUTH MATRIX');
    console.log('================================================================');
    console.log('| Metric | Prisma | API | Delta | Status |');
    console.log('| :--- | :--- | :--- | :--- | :--- |');
    for (const r of truthResults) {
      console.log(`| ${r.metric} | ${r.prismaVal} | ${r.apiVal} | ${r.delta} | ${r.status} |`);
    }

    const allPassed = truthResults.every((r) => r.status === 'MATCH');
    console.log(`\nOverall Truth Status: ${allPassed ? '100% MATCH' : 'DISCREPANCY DETECTED'}`);
  } finally {
    server.close();
  }
}

runPhase4ComprehensiveAudit().catch((err) => {
  console.error('Audit crashed:', err);
  process.exit(1);
});
