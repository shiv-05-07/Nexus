import { prisma } from '../backend/src/db/prisma';

async function verify() {
  console.log('--- Commencing Comprehensive Database Verification ---');

  // 1. Table Counts
  const [usersCount, postsCount, topicsCount, commsCount, engCount, edgesCount] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.topic.count(),
    prisma.community.count(),
    prisma.engagement.count(),
    prisma.networkEdge.count(),
  ]);

  console.log('Actual Table Counts:');
  console.log(`  Users:        ${usersCount}`);
  console.log(`  Posts:        ${postsCount}`);
  console.log(`  Topics:       ${topicsCount}`);
  console.log(`  Communities:  ${commsCount}`);
  console.log(`  Engagements:  ${engCount}`);
  console.log(`  Network Edges:${edgesCount}`);

  // 2. Relational integrity check: Sample Post with Author, Topic, and Community
  const samplePost = await prisma.post.findFirst({
    where: { topicId: { not: null } },
    include: {
      author: {
        include: { community: true },
      },
      topic: true,
      engagements: { take: 3 },
    },
  });

  console.log('\n--- Representative Post & Relationships ---');
  console.log(`  Post ID:          ${samplePost?.id}`);
  console.log(`  Platform:         ${samplePost?.platform}`);
  console.log(`  Content:          ${samplePost?.content}`);
  console.log(`  Author:           ${samplePost?.author?.displayName} (${samplePost?.author?.handle})`);
  console.log(`  Author Community: ${samplePost?.author?.community?.name}`);
  console.log(`  Topic:            ${samplePost?.topic?.name}`);
  console.log(`  Sentiment:        ${samplePost?.sentiment} (Score: ${samplePost?.sentimentScore})`);
  console.log(`  Emotion:          ${samplePost?.emotion} (Score: ${samplePost?.emotionScore})`);
  console.log(`  Sample Engagements: ${samplePost?.engagements.length}`);

  // 3. Relational integrity check: Sample Network Edge with Source and Target Users
  const sampleEdge = await prisma.networkEdge.findFirst({
    include: {
      sourceUser: { include: { community: true } },
      targetUser: { include: { community: true } },
    },
  });

  console.log('\n--- Representative Network Edge & Relationships ---');
  console.log(`  Edge ID:          ${sampleEdge?.id}`);
  console.log(`  Platform:         ${sampleEdge?.platform}`);
  console.log(`  Interaction Type: ${sampleEdge?.interactionType}`);
  console.log(`  Weight:           ${sampleEdge?.weight}`);
  console.log(`  Source:           ${sampleEdge?.sourceUser?.handle} [${sampleEdge?.sourceUser?.community?.name}]`);
  console.log(`  Target:           ${sampleEdge?.targetUser?.handle} [${sampleEdge?.targetUser?.community?.name}]`);

  // 4. Platform breakdown across Posts
  const platformGroups = await prisma.post.groupBy({
    by: ['platform'],
    _count: { id: true },
  });
  console.log('\n--- Posts Distribution by Platform ---');
  platformGroups.forEach((g) => console.log(`  ${g.platform.padEnd(10)}: ${g._count.id}`));

  // 5. Sentiment breakdown across Posts
  const sentimentGroups = await prisma.post.groupBy({
    by: ['sentiment'],
    _count: { id: true },
  });
  console.log('\n--- Posts Distribution by Sentiment ---');
  sentimentGroups.forEach((g) => console.log(`  ${g.sentiment.padEnd(10)}: ${g._count.id}`));

  await prisma.$disconnect();
  console.log('\n--- Verification Succeeded ---');
}

verify().catch((e) => {
  console.error('Verification failed:', e);
  process.exit(1);
});
