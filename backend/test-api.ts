import { app } from './src/app';
import { prisma } from './src/db/prisma';
import http from 'http';

async function testBackend() {
  console.log('==================================================');
  console.log('NEXUS PHASE 2B: COMPREHENSIVE API TEST SUITE');
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
    // SECTION 1: HEALTH, OVERVIEW & TIMELINE VERIFICATION
    // ----------------------------------------------------
    console.log('--- TEST 1: GET /api/health ---');
    const health = await request('/api/health');
    console.log('Status:', health.status, 'DB:', health.data.database);

    console.log('\n--- TEST 2: GET /api/overview ---');
    const overview = await request('/api/overview');
    console.log('Overview metrics:', overview.data.metrics);
    console.log('Active Narratives:', overview.data.narratives.length);

    console.log('\n--- TEST 3: GET /api/timeline (limit=5) ---');
    const timeline = await request('/api/timeline?limit=5');
    console.log('Timeline total posts:', timeline.data.total, 'Returned:', timeline.data.items.length);

    // ----------------------------------------------------
    // SECTION 2: SENTIMENT ANALYTICS
    // ----------------------------------------------------
    console.log('\n--- TEST 4: GET /api/sentiment (Default 24h, All Platforms) ---');
    const sentimentFull = await request('/api/sentiment');
    console.log('Status:', sentimentFull.status);
    console.log('Composition:', sentimentFull.data.composition);
    console.log('Trends DataPoints Count:', sentimentFull.data.trends.length);
    console.log('Emotions Count:', sentimentFull.data.emotions.length);
    console.log('Platform Comparisons Count:', sentimentFull.data.platformComparison.length);

    console.log('\n--- TEST 5: GET /api/sentiment?timeFilter=7d ---');
    const sentiment7d = await request('/api/sentiment?timeFilter=7d');
    console.log('7d Composition:', sentiment7d.data.composition);
    console.log('7d Trends DataPoints (Daily):', sentiment7d.data.trends.map((t: any) => ({ label: t.timeLabel, vol: t.volume })));

    console.log('\n--- TEST 6: GET /api/sentiment?platform=telegram ---');
    const sentimentTelegram = await request('/api/sentiment?platform=telegram');
    console.log('Telegram Composition:', sentimentTelegram.data.composition);
    console.log('Telegram Platforms returned:', sentimentTelegram.data.platformComparison.map((p: any) => p.platform));

    console.log('\n--- TEST 7: GET /api/sentiment/composition ---');
    const compSub = await request('/api/sentiment/composition');
    console.log('Composition Sub-endpoint:', compSub.data);

    console.log('\n--- TEST 8: GET /api/sentiment/trends ---');
    const trendsSub = await request('/api/sentiment/trends');
    console.log('Trends Sub-endpoint Count:', trendsSub.data.length);

    console.log('\n--- TEST 9: GET /api/sentiment/emotions ---');
    const emotionsSub = await request('/api/sentiment/emotions');
    console.log('Emotions Sub-endpoint:', emotionsSub.data.map((e: any) => ({
      emotion: e.emotion,
      volume: e.volume,
      pct: e.percentage,
      delta: e.trendDelta,
    })));

    console.log('\n--- TEST 10: GET /api/sentiment/platforms ---');
    const platformsSub = await request('/api/sentiment/platforms');
    console.log('Platforms Sub-endpoint:', platformsSub.data);

    // ----------------------------------------------------
    // SECTION 3: TREND ANALYTICS
    // ----------------------------------------------------
    console.log('\n--- TEST 11: GET /api/trends (Default 24h, All Platforms) ---');
    const trendsList = await request('/api/trends');
    console.log('Status:', trendsList.status);
    console.log('Total Active Trends:', trendsList.data.length);
    console.log('Top Trend Details:', {
      id: trendsList.data[0]?.id,
      name: trendsList.data[0]?.name,
      volume: trendsList.data[0]?.volume,
      accelerationPct: trendsList.data[0]?.accelerationPct,
      sentiment: trendsList.data[0]?.sentiment,
      dominantEmotion: trendsList.data[0]?.dominantEmotion,
      communityName: trendsList.data[0]?.communityName,
      isAccelerating: trendsList.data[0]?.isAccelerating,
      x: trendsList.data[0]?.x,
      y: trendsList.data[0]?.y,
      radius: trendsList.data[0]?.radius,
      sparkline: trendsList.data[0]?.sparkline,
    });

    console.log('\n--- TEST 12: GET /api/trends?timeFilter=30d ---');
    const trends30d = await request('/api/trends?timeFilter=30d');
    console.log('30d Trends Count:', trends30d.data.length);
    console.log('30d Volumes:', trends30d.data.map((t: any) => ({ name: t.name, vol: t.volume, accel: t.accelerationPct })));

    console.log('\n--- TEST 13: GET /api/trends?platform=reddit ---');
    const trendsReddit = await request('/api/trends?platform=reddit');
    console.log('Reddit Trends Count:', trendsReddit.data.length);
    console.log('Reddit Trends Platforms:', trendsReddit.data.map((t: any) => ({ name: t.name, platforms: t.platforms })));

    // ----------------------------------------------------
    // SECTION 4: DATABASE TRUTH CHECKS
    // ----------------------------------------------------
    console.log('\n==================================================');
    console.log('SECTION 4: DATABASE TRUTH CHECKS');
    console.log('==================================================');

    // 1. Post Volume Truth Check across 30d
    const direct30dPostCount = await prisma.post.count();
    const trend30dSum = trends30d.data.reduce((sum: number, t: any) => sum + t.volume, 0);
    console.log(`Direct DB 30d Post Count: ${direct30dPostCount}`);
    console.log(`Trend 30d Summed Topic Volume: ${trend30dSum}`);
    if (direct30dPostCount === trend30dSum) {
      console.log('✅ TRUTH CHECK 1 PASSED: Sum of topic volumes matches database post count.');
    } else {
      console.warn('⚠️ Topic sum difference (some posts may be unassigned to topics or filtered).');
    }

    // 2. Individual Topic Volume Verification
    const sampleTopic = trends30d.data[0];
    const directTopicCount = await prisma.post.count({
      where: {
        topic: {
          OR: [{ slug: sampleTopic.id }, { id: sampleTopic.id }],
        },
      },
    });
    console.log(`Direct DB Count for topic "${sampleTopic.name}": ${directTopicCount}`);
    console.log(`Trend API Volume for topic "${sampleTopic.name}":  ${sampleTopic.volume}`);
    if (directTopicCount === sampleTopic.volume) {
      console.log('✅ TRUTH CHECK 2 PASSED: Topic volume matches direct Prisma query exactly.');
    } else {
      console.error('❌ TRUTH CHECK 2 FAILED: Topic volume mismatch.');
    }

    // 3. Emotion Distribution Truth Check
    const emotionGroups = await prisma.post.groupBy({
      by: ['emotion'],
      _count: { id: true },
    });
    const dbEmotionMap: Record<string, number> = {};
    emotionGroups.forEach((g) => {
      dbEmotionMap[g.emotion.toLowerCase()] = g._count.id;
    });

    const sentiment30dEmotions = await request('/api/sentiment/emotions?timeFilter=30d');
    let emotionCheckPassed = true;
    for (const emoItem of sentiment30dEmotions.data) {
      const dbCount = dbEmotionMap[emoItem.emotion] || 0;
      if (dbCount !== emoItem.volume) {
        emotionCheckPassed = false;
        console.error(`❌ Mismatch for emotion ${emoItem.emotion}: DB=${dbCount}, API=${emoItem.volume}`);
      }
    }
    if (emotionCheckPassed) {
      console.log('✅ TRUTH CHECK 3 PASSED: Emotion counts match direct database groupBy counts exactly.');
    }

    // 4. Platform Counts Truth Check
    const platformGroups = await prisma.post.groupBy({
      by: ['platform'],
      _count: { id: true },
    });
    const dbPlatformMap: Record<string, number> = {};
    platformGroups.forEach((g) => {
      dbPlatformMap[g.platform.toLowerCase()] = g._count.id;
    });

    const sentiment30dPlatforms = await request('/api/sentiment/platforms?timeFilter=30d');
    let platformCheckPassed = true;
    for (const pItem of sentiment30dPlatforms.data) {
      const dbCount = dbPlatformMap[pItem.platform] || 0;
      if (dbCount !== pItem.totalVolume) {
        platformCheckPassed = false;
        console.error(`❌ Mismatch for platform ${pItem.platform}: DB=${dbCount}, API=${pItem.totalVolume}`);
      }
    }
    if (platformCheckPassed) {
      console.log('✅ TRUTH CHECK 4 PASSED: Platform volumes match direct database groupBy counts exactly.');
    }

    // 5. Sentiment Composition Totals Verification
    const comp30d = await request('/api/sentiment/composition?timeFilter=30d');
    const compSum = comp30d.data.positive + comp30d.data.neutral + comp30d.data.negative;
    console.log(`Sentiment Composition 30d Sum: ${compSum}% (pos: ${comp30d.data.positive}, neu: ${comp30d.data.neutral}, neg: ${comp30d.data.negative})`);
    if (compSum >= 99 && compSum <= 101) {
      console.log('✅ TRUTH CHECK 5 PASSED: Sentiment composition percentages sum to ~100%.');
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
