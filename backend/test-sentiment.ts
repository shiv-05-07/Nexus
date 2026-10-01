import { app } from './src/app';
import { prisma } from './src/db/prisma';
import http from 'http';

async function runSentimentTruthAndAudit() {
  console.log('================================================================');
  console.log('NEXUS PHASE 3C: SENTIMENT REAL ANALYTICS TRUTH & INTEGRATION AUDIT');
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
    // TEST 1: Default GET /api/sentiment (24h, All Platforms)
    // ----------------------------------------------------
    console.log('--- TEST 1: GET /api/sentiment (Default 24h, All Platforms) ---');
    const defaultRes = await request('/api/sentiment');
    console.log('Status:', defaultRes.status);
    console.log('Composition:', defaultRes.data.composition);
    console.log('Trends count:', defaultRes.data.trends.length);
    console.log('Emotions count:', defaultRes.data.emotions.length);
    console.log('Platform comparison count:', defaultRes.data.platformComparison.length);
    console.log('Sample trend point:', defaultRes.data.trends[0]);
    console.log('Sample emotion:', defaultRes.data.emotions[0]);

    // ----------------------------------------------------
    // TEST 2: GET /api/sentiment?timeFilter=24h
    // ----------------------------------------------------
    console.log('\n--- TEST 2: GET /api/sentiment?timeFilter=24h ---');
    const res24h = await request('/api/sentiment?timeFilter=24h');
    console.log('24h Composition:', res24h.data.composition);
    console.log('24h Total Analyzed:', res24h.data.composition.totalAnalyzed);

    // ----------------------------------------------------
    // TEST 3: GET /api/sentiment?timeFilter=7d
    // ----------------------------------------------------
    console.log('\n--- TEST 3: GET /api/sentiment?timeFilter=7d ---');
    const res7d = await request('/api/sentiment?timeFilter=7d');
    console.log('7d Composition:', res7d.data.composition);
    console.log('7d Trend intervals count:', res7d.data.trends.length);
    console.log('7d Total Analyzed:', res7d.data.composition.totalAnalyzed);

    // ----------------------------------------------------
    // TEST 4: GET /api/sentiment?platform=reddit
    // ----------------------------------------------------
    console.log('\n--- TEST 4: GET /api/sentiment?platform=reddit ---');
    const resReddit = await request('/api/sentiment?platform=reddit');
    console.log('Reddit Composition:', resReddit.data.composition);
    console.log('Reddit Platform array:', resReddit.data.platformComparison);

    // ----------------------------------------------------
    // TEST 5: GET /api/sentiment?platform=x&timeFilter=1h
    // ----------------------------------------------------
    console.log('\n--- TEST 5: GET /api/sentiment?platform=x&timeFilter=1h ---');
    const resX1h = await request('/api/sentiment?platform=x&timeFilter=1h');
    console.log('X 1h Composition:', resX1h.data.composition);

    // ----------------------------------------------------
    // TEST 6: Subroutes check
    // ----------------------------------------------------
    console.log('\n--- TEST 6: Subroutes verification ---');
    const compSub = await request('/api/sentiment/composition?timeFilter=24h');
    console.log('Subroute /composition:', compSub.status, compSub.data);
    const trendsSub = await request('/api/sentiment/trends?timeFilter=24h');
    console.log('Subroute /trends length:', trendsSub.data.length);
    const emoSub = await request('/api/sentiment/emotions?timeFilter=24h');
    console.log('Subroute /emotions length:', emoSub.data.length);
    const platSub = await request('/api/sentiment/platforms?timeFilter=24h');
    console.log('Subroute /platforms length:', platSub.data.length);

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

    // Truth Check 1: 24h Post Count
    const db24hCount = await prisma.post.count({
      where: { createdAt: { gte: since24h } },
    });
    console.log(`Direct DB 24h Post Count: ${db24hCount}`);
    console.log(`API Sentiment totalAnalyzed: ${res24h.data.composition.totalAnalyzed}`);
    if (db24hCount === res24h.data.composition.totalAnalyzed) {
      console.log('✅ TRUTH CHECK 1 PASSED: totalAnalyzed exactly matches 24h Post count in DB.');
    } else {
      console.error('❌ TRUTH CHECK 1 FAILED: Mismatch in 24h count.');
    }

    // Truth Check 2: 24h Sentiment Breakdown
    const db24hSentiments = await prisma.post.groupBy({
      by: ['sentiment'],
      where: { createdAt: { gte: since24h } },
      _count: { id: true },
    });
    console.log('Direct DB 24h Sentiment counts:', db24hSentiments);
    const comp24h = res24h.data.composition;
    console.log(`API 24h Percentages: Positive: ${comp24h.positive}%, Neutral: ${comp24h.neutral}%, Negative: ${comp24h.negative}%`);
    const sumPct = comp24h.positive + comp24h.neutral + comp24h.negative;
    if (sumPct >= 99 && sumPct <= 101) {
      console.log(`✅ TRUTH CHECK 2 PASSED: Sentiment percentages sum to ${sumPct}%.`);
    } else {
      console.error(`❌ TRUTH CHECK 2 FAILED: Sum is ${sumPct}%.`);
    }

    // Truth Check 3: Emotion breakdown matches DB counts
    const dbEmotions = await prisma.post.groupBy({
      by: ['emotion'],
      where: { createdAt: { gte: since24h } },
      _count: { id: true },
    });
    console.log('Direct DB 24h Emotion counts:', dbEmotions);
    console.log('API Emotions response volumes:', res24h.data.emotions.map((e: any) => ({ emotion: e.emotion, vol: e.volume, pct: e.percentage })));
    const totalApiEmoVol = res24h.data.emotions.reduce((acc: number, e: any) => acc + e.volume, 0);
    console.log(`Total Emotion Volume: ${totalApiEmoVol}, DB Total: ${db24hCount}`);
    if (totalApiEmoVol === db24hCount) {
      console.log('✅ TRUTH CHECK 3 PASSED: Total emotion volumes exactly match DB post count.');
    } else {
      console.error('❌ TRUTH CHECK 3 FAILED: Emotion volume mismatch.');
    }

    // Truth Check 4: Platform breakdown volumes match DB counts
    const dbPlatforms = await prisma.post.groupBy({
      by: ['platform'],
      where: { createdAt: { gte: since24h } },
      _count: { id: true },
    });
    console.log('Direct DB 24h Platform counts:', dbPlatforms);
    console.log('API Platform comparison volumes:', res24h.data.platformComparison.map((p: any) => ({ platform: p.platform, vol: p.totalVolume })));
    const totalApiPlatVol = res24h.data.platformComparison.reduce((acc: number, p: any) => acc + p.totalVolume, 0);
    if (totalApiPlatVol === db24hCount) {
      console.log('✅ TRUTH CHECK 4 PASSED: Total platform volumes exactly match DB post count.');
    } else {
      console.error('❌ TRUTH CHECK 4 FAILED: Platform volume mismatch.');
    }

    // Truth Check 5: Trend series total volume matches DB count
    const totalTrendVol = res24h.data.trends.reduce((acc: number, t: any) => acc + t.volume, 0);
    console.log(`Total Trend Series Volume: ${totalTrendVol}, DB Total: ${db24hCount}`);
    if (totalTrendVol === db24hCount) {
      console.log('✅ TRUTH CHECK 5 PASSED: Sum of trend bucket volumes equals DB post count.');
    } else {
      console.error('❌ TRUTH CHECK 5 FAILED: Trend series volume mismatch.');
    }

  } finally {
    server.close();
    await prisma.$disconnect();
    console.log('\n--- All Sentiment Backend Tests & Truth Checks Completed ---');
  }
}

runSentimentTruthAndAudit().catch((e) => {
  console.error('Test failed:', e);
  process.exit(1);
});
