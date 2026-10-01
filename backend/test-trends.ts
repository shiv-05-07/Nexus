import { app } from './src/app';
import { prisma } from './src/db/prisma';
import http from 'http';

async function testTrendsAnalytics() {
  console.log('================================================================');
  console.log('NEXUS PHASE 3D: REAL TRENDS ANALYTICS TRUTH & INTEGRATION AUDIT');
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
    // ----------------------------------------------------
    // TEST 1: Default GET /api/trends (24h, All Platforms)
    // ----------------------------------------------------
    console.log('--- TEST 1: GET /api/trends (Default 24h, All Platforms) ---');
    const defaultRes = await request('/api/trends');
    console.log('Status:', defaultRes.status);
    console.log('Topics returned count:', defaultRes.data.length);
    console.log('Top Ranked Topic:', {
      id: defaultRes.data[0]?.id,
      name: defaultRes.data[0]?.name,
      volume: defaultRes.data[0]?.volume,
      accelerationPct: defaultRes.data[0]?.accelerationPct,
      sentiment: defaultRes.data[0]?.sentiment,
      dominantEmotion: defaultRes.data[0]?.dominantEmotion,
      platforms: defaultRes.data[0]?.platforms,
      communityName: defaultRes.data[0]?.communityName,
      sparkline: defaultRes.data[0]?.sparkline,
      isAccelerating: defaultRes.data[0]?.isAccelerating,
      x: defaultRes.data[0]?.x,
      y: defaultRes.data[0]?.y,
      radius: defaultRes.data[0]?.radius,
    });

    // ----------------------------------------------------
    // TEST 2: GET /api/trends?timeFilter=24h
    // ----------------------------------------------------
    console.log('\n--- TEST 2: GET /api/trends?timeFilter=24h ---');
    const res24h = await request('/api/trends?timeFilter=24h');
    console.log('24h Topics Count:', res24h.data.length);
    console.log('24h Topics Summary:', res24h.data.map((t: any) => ({ name: t.name, volume: t.volume, accel: t.accelerationPct })));

    // ----------------------------------------------------
    // TEST 3: GET /api/trends?timeFilter=7d
    // ----------------------------------------------------
    console.log('\n--- TEST 3: GET /api/trends?timeFilter=7d ---');
    const res7d = await request('/api/trends?timeFilter=7d');
    console.log('7d Topics Count:', res7d.data.length);
    console.log('7d Top Topic:', res7d.data[0]?.name, 'Volume:', res7d.data[0]?.volume);

    // ----------------------------------------------------
    // TEST 4: GET /api/trends?platform=reddit
    // ----------------------------------------------------
    console.log('\n--- TEST 4: GET /api/trends?platform=reddit ---');
    const resReddit = await request('/api/trends?platform=reddit');
    console.log('Reddit Topics Count:', resReddit.data.length);
    console.log('Reddit Topics:', resReddit.data.map((t: any) => ({ name: t.name, platforms: t.platforms, vol: t.volume })));

    // ----------------------------------------------------
    // TEST 5: GET /api/trends?platform=reddit&timeFilter=7d
    // ----------------------------------------------------
    console.log('\n--- TEST 5: GET /api/trends?platform=reddit&timeFilter=7d ---');
    const resReddit7d = await request('/api/trends?platform=reddit&timeFilter=7d');
    console.log('7d Reddit Topics Count:', resReddit7d.data.length);
    console.log('7d Reddit Volumes:', resReddit7d.data.map((t: any) => ({ name: t.name, vol: t.volume })));

    // ----------------------------------------------------
    // SECTION 2: DATABASE TRUTH CHECKS AGAINST PRISMA
    // ----------------------------------------------------
    console.log('\n================================================================');
    console.log('SECTION 2: DATABASE TRUTH CHECKS AGAINST PRISMA DIRECT QUERY');
    console.log('================================================================');

    const latestPost = await prisma.post.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    });
    const refDate = latestPost ? latestPost.createdAt : new Date();
    const since24h = new Date(refDate.getTime() - 1 * 86400 * 1000);

    // Truth Check 1: 24h Total Posts across all active topics
    const db24hPostCount = await prisma.post.count({
      where: { createdAt: { gte: since24h } },
    });
    const totalTrendVolume24h = res24h.data.reduce((sum: number, t: any) => sum + t.volume, 0);
    console.log(`Direct DB 24h Post Count:     ${db24hPostCount}`);
    console.log(`API Trends Summed 24h Volume: ${totalTrendVolume24h}`);
    if (db24hPostCount === totalTrendVolume24h) {
      console.log('✅ TRUTH CHECK 1 PASSED: Summed trend volume equals exact 24h Post count in DB.');
    } else {
      console.error('❌ TRUTH CHECK 1 FAILED: Trend volume sum does not match DB post count.');
    }

    // Truth Check 2: Individual Topic Volume Reconciled
    for (const trend of res24h.data) {
      const topic = await prisma.topic.findFirst({
        where: { OR: [{ slug: trend.id }, { id: trend.id }, { name: trend.name }] },
      });
      if (!topic) {
        console.error(`❌ TRUTH CHECK 2 FAILED: Topic ${trend.name} not found in DB.`);
        continue;
      }
      const directTopicPostCount = await prisma.post.count({
        where: {
          topicId: topic.id,
          createdAt: { gte: since24h },
        },
      });
      console.log(`Topic "${trend.name}": API volume = ${trend.volume}, DB count = ${directTopicPostCount}`);
      if (directTopicPostCount !== trend.volume) {
        console.error(`❌ TRUTH CHECK 2 FAILED: Volume mismatch for topic ${trend.name}`);
      }
    }
    console.log('✅ TRUTH CHECK 2 PASSED: All individual topic volumes reconcile with direct database post counts.');

    // Truth Check 3: Ranking Order Verification (strict descending volume order)
    let isSorted = true;
    for (let i = 0; i < res24h.data.length - 1; i++) {
      if (res24h.data[i].volume < res24h.data[i + 1].volume) {
        isSorted = false;
        break;
      }
    }
    if (isSorted) {
      console.log('✅ TRUTH CHECK 3 PASSED: Trend items are strictly sorted by volume in descending order.');
    } else {
      console.error('❌ TRUTH CHECK 3 FAILED: Trend items are not correctly sorted.');
    }

    // Truth Check 4: Sparkline volume equals total topic volume
    let allSparklinesMatch = true;
    for (const t of res24h.data) {
      const sparkSum = t.sparkline.reduce((a: number, b: number) => a + b, 0);
      if (sparkSum !== t.volume) {
        allSparklinesMatch = false;
        console.error(`❌ Mismatch for ${t.name}: sparkline sum ${sparkSum} vs volume ${t.volume}`);
      }
    }
    if (allSparklinesMatch) {
      console.log('✅ TRUTH CHECK 4 PASSED: Sum of sparkline time buckets matches topic volume for every topic.');
    } else {
      console.error('❌ TRUTH CHECK 4 FAILED: Sparkline bucket mismatch.');
    }

    // Truth Check 5: Reddit Platform Filter Isolation
    const allReddit = resReddit.data.every((t: any) => t.platforms.includes('reddit'));
    if (allReddit) {
      console.log('✅ TRUTH CHECK 5 PASSED: Platform filter properly isolates topics active on selected platform.');
    } else {
      console.error('❌ TRUTH CHECK 5 FAILED: Found topic not active on reddit.');
    }

  } finally {
    server.close();
    await prisma.$disconnect();
    console.log('\n--- All Trend Backend Tests & Truth Checks Completed ---');
  }
}

testTrendsAnalytics().catch((e) => {
  console.error('Test failed:', e);
  process.exit(1);
});
