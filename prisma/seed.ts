import { PrismaClient, Platform, SentimentType, EmotionType, EngagementType } from '@prisma/client';

if (process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.replace(/^["']|["']$/g, '').trim();
}
if (process.env.DIRECT_URL) {
  process.env.DIRECT_URL = process.env.DIRECT_URL.replace(/^["']|["']$/g, '').trim();
}

const prisma = new PrismaClient();

// Deterministic PRNG (Mulberry32)
function createPRNG(seed = 424242) {
  let s = seed;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = createPRNG(987654321);

function pickRandom<T>(array: T[]): T {
  return array[Math.floor(random() * array.length)];
}

function randomBetween(min: number, max: number): number {
  return min + random() * (max - min);
}

function randomInt(min: number, max: number): number {
  return Math.floor(randomBetween(min, max + 1));
}

// Master reference timestamp: 2026-10-01T09:00:00Z
const REF_TIMESTAMP = Date.parse('2026-10-01T09:00:00Z');
const MS_PER_DAY = 86400 * 1000;
const MS_PER_HOUR = 3600 * 1000;

export async function main() {
  console.log('--- NEXUS Database Seed Process Initializing ---');

  // 1. Clean synthetic data safely
  console.log('Cleaning prior synthetic records...');
  try {
    await prisma.networkEdge.deleteMany({ where: { isSynthetic: true } });
    await prisma.engagement.deleteMany({ where: { isSynthetic: true } });
    await prisma.post.deleteMany({ where: { isSynthetic: true } });
    await prisma.user.deleteMany({ where: { isSynthetic: true } });
    await prisma.topic.deleteMany({ where: { isSynthetic: true } });
    await prisma.community.deleteMany({ where: { isSynthetic: true } });
  } catch (err) {
    console.log('Initial table state empty or uninitialized. Proceeding with creation...');
  }

  // 2. Create Communities
  console.log('Seeding Communities...');
  const communityDefs = [
    {
      id: 'comm_01',
      slug: 'comm-1',
      name: 'Transit & Commuter Groups',
      description: 'Daily passenger associations, regional carpool networks, and neighborhood mobility groups.',
      color: '#2563EB',
    },
    {
      id: 'comm_02',
      slug: 'comm-2',
      name: 'Municipal & Operator Councils',
      description: 'Transit directorate liaisons, operator union representatives, and municipal logistics desks.',
      color: '#7C3AED',
    },
    {
      id: 'comm_03',
      slug: 'comm-3',
      name: 'Civic & Policy Watchdogs',
      description: 'Consumer rights advocates, municipal audit observers, and public policy analysts.',
      color: '#0891B2',
    },
    {
      id: 'comm_04',
      slug: 'comm-4',
      name: 'Media & Dispatch Outlets',
      description: 'Regional news wires, traffic dispatch radio accounts, and digital livestream reporters.',
      color: '#D97706',
    },
  ];

  await prisma.community.createMany({
    data: communityDefs.map((def) => ({
      id: def.id,
      slug: def.slug,
      name: def.name,
      description: def.description,
      color: def.color,
      isSynthetic: true,
    })),
  });

  const communities = await prisma.community.findMany({ where: { isSynthetic: true } });
  const [commTransit, commMunicipal, commCivic, commMedia] = communities;

  // 3. Create Topics / Narratives
  console.log('Seeding Topics...');
  const topicDefs = [
    {
      id: 'top_01',
      slug: 'nar-01',
      name: 'Public Transport Strike & Fare Revision',
      description: 'Spontaneous strike announcement across metropolitan bus depots triggered widespread commuter distress, coordination of alternate carpools, and rapid escalation to municipal accountability demands.',
      firstObservedAt: new Date(REF_TIMESTAMP - 2 * MS_PER_DAY),
      lastObservedAt: new Date(REF_TIMESTAMP - 5 * 60 * 1000),
    },
    {
      id: 'top_02',
      slug: 'nar-02',
      name: 'Emergency Healthcare Ordinance Debate',
      description: 'Public discourse regarding new pharmaceutical procurement guidelines, marked by sharp policy debate between medical unions and civic consumer forums.',
      firstObservedAt: new Date(REF_TIMESTAMP - 7 * MS_PER_DAY),
      lastObservedAt: new Date(REF_TIMESTAMP - 15 * 60 * 1000),
    },
    {
      id: 'top_03',
      slug: 'nar-03',
      name: 'Municipal Cleanliness & Waste Route Overhaul',
      description: 'Neighborhood-level tracking of updated solid waste collection routes with strong civic participation across ward forums.',
      firstObservedAt: new Date(REF_TIMESTAMP - 14 * MS_PER_DAY),
      lastObservedAt: new Date(REF_TIMESTAMP - 35 * 60 * 1000),
    },
    {
      id: 'top_04',
      slug: 'nar-04',
      name: 'Secondary Education Tech Infrastructure Pilot',
      description: 'Discussion regarding high-speed fiber connectivity and digital classroom tool installations in suburban secondary schools.',
      firstObservedAt: new Date(REF_TIMESTAMP - 18 * MS_PER_DAY),
      lastObservedAt: new Date(REF_TIMESTAMP - 2 * MS_PER_HOUR),
    },
    {
      id: 'top_05',
      slug: 'nar-05',
      name: 'Carpool Inter-City Coordination Protocol',
      description: 'Community-led peer vehicle pooling initiatives organized via messaging groups to mitigate corridor congestion during service disruptions.',
      firstObservedAt: new Date(REF_TIMESTAMP - 1 * MS_PER_DAY),
      lastObservedAt: new Date(REF_TIMESTAMP - 10 * 60 * 1000),
    },
    {
      id: 'top_06',
      slug: 'nar-06',
      name: 'Surge Pricing Anti-Gouging Petitions',
      description: 'Consumer petition waves challenging ride-hailing multiplier rates during acute transport stoppage hours.',
      firstObservedAt: new Date(REF_TIMESTAMP - 4 * MS_PER_DAY),
      lastObservedAt: new Date(REF_TIMESTAMP - 1 * MS_PER_HOUR),
    },
    {
      id: 'top_07',
      slug: 'nar-07',
      name: 'Suburban Rail Modernization & Signal Upgrades',
      description: 'Longitudinal capital expenditure project tracking for automatic signaling along the western industrial commuter corridor.',
      firstObservedAt: new Date(REF_TIMESTAMP - 28 * MS_PER_DAY),
      lastObservedAt: new Date(REF_TIMESTAMP - 12 * MS_PER_HOUR),
    },
    {
      id: 'top_08',
      slug: 'nar-08',
      name: 'Smart Meter Tariff Calibration & Energy Subsidies',
      description: 'Civic debates regarding peak-hour municipal power tariffs and industrial tier subsidies.',
      firstObservedAt: new Date(REF_TIMESTAMP - 25 * MS_PER_DAY),
      lastObservedAt: new Date(REF_TIMESTAMP - 6 * MS_PER_HOUR),
    },
  ];

  await prisma.topic.createMany({
    data: topicDefs.map((def) => ({
      id: def.id,
      slug: def.slug,
      name: def.name,
      description: def.description,
      firstObservedAt: def.firstObservedAt,
      lastObservedAt: def.lastObservedAt,
      isSynthetic: true,
    })),
  });

  const topics = await prisma.topic.findMany({ where: { isSynthetic: true }, orderBy: { id: 'asc' } });

  // 4. Create 100 Realistic Users across 4 Platforms & 4 Communities
  console.log('Seeding 100 Users across platforms & communities...');
  
  const anchorUserDefs = [
    { platform: Platform.X, handle: '@metro_watch', displayName: 'Metro Transit Wire', alias: 'Central Commuter Hub', role: 'Central Commuter Hub', communityId: commTransit.id, verified: true, avatarColor: '#2563EB' },
    { platform: Platform.TELEGRAM, handle: 'TransitActionHQ', displayName: 'Union Information Desk', alias: 'Union Information Desk', role: 'Union Spokesperson', communityId: commMunicipal.id, verified: true, avatarColor: '#7C3AED' },
    { platform: Platform.X, handle: '@urban_pulse_in', displayName: 'Urban Dispatch Network', alias: 'Urban Dispatch', role: 'High-Volume News Node', communityId: commMedia.id, verified: false, avatarColor: '#D97706' },
    { platform: Platform.REDDIT, handle: 'u/CivicHealthObserver', displayName: 'Healthcare Policy Watch', alias: 'Policy Researcher', role: 'Policy Researcher', communityId: commCivic.id, verified: true, avatarColor: '#0891B2' },
    { platform: Platform.TELEGRAM, handle: '@commuter_liaison', displayName: 'Inter-Community Mediator', alias: 'Inter-Community Mediator', role: 'Structural Bridge Node', communityId: commTransit.id, verified: true, avatarColor: '#2563EB' },
    { platform: Platform.REDDIT, handle: 'Ward7CivicForum', displayName: 'Ward 7 Civic Alliance', alias: 'Ward 7 Alliance', role: 'Local Council Watchdog', communityId: commCivic.id, verified: false, avatarColor: '#0891B2' },
    { platform: Platform.TELEGRAM, handle: 'MetroFleetOps', displayName: 'Depot Fleet Coordinator', alias: 'Depot Fleet Ops', role: 'Technical Operations', communityId: commMunicipal.id, verified: true, avatarColor: '#7C3AED' },
    { platform: Platform.YOUTUBE, handle: 'EduReformChannel', displayName: 'Education Reform Wire', alias: 'Education Wire', role: 'Specialized Media', communityId: commMedia.id, verified: true, avatarColor: '#D97706' },
    { platform: Platform.X, handle: '@press_transit_desk', displayName: 'Senior Transport Correspondent', alias: 'Senior Transport Desk', role: 'Cross-Sector Bridge Node', communityId: commMedia.id, verified: true, avatarColor: '#D97706' },
    { platform: Platform.TELEGRAM, handle: 'RideShareReliefGroup', displayName: 'Volunteer Carpool Relay', alias: 'Carpool Relay', role: 'Mutual Aid Facilitator', communityId: commTransit.id, verified: false, avatarColor: '#2563EB' },
    { platform: Platform.X, handle: '@dept_mobility', displayName: 'Municipal Logistics Desk', alias: 'Mobility Secretariat', role: 'Regulatory Authority', communityId: commMunicipal.id, verified: true, avatarColor: '#7C3AED' },
    { platform: Platform.REDDIT, handle: 'u/MetroCommuteUnion', displayName: 'Regional Labor Council', alias: 'Labor Council', role: 'Organized Labor Federation', communityId: commMunicipal.id, verified: true, avatarColor: '#7C3AED' },
    { platform: Platform.YOUTUBE, handle: 'AuditTransparency', displayName: 'Public Expenditure Watchdog', alias: 'Ombudsman Stream', role: 'Civic Ombudsman', communityId: commCivic.id, verified: true, avatarColor: '#0891B2' },
    { platform: Platform.YOUTUBE, handle: 'StateNewsWire', displayName: 'National News Wire', alias: 'State News Agency', role: 'Institutional News', communityId: commMedia.id, verified: true, avatarColor: '#D97706' },
    { platform: Platform.TELEGRAM, handle: 'CityAlertChannel', displayName: 'City Emergency Alert Bot', alias: 'Emergency Alert Bot', role: 'Real-Time Alert Broadcaster', communityId: commMedia.id, verified: true, avatarColor: '#D97706' },
    { platform: Platform.REDDIT, handle: 'u/TechWorkerExpress', displayName: 'IT Corridor Representative', alias: 'Tech Park Liaison', role: 'Carpool & Shuttle Coordination', communityId: commTransit.id, verified: false, avatarColor: '#2563EB' },
    { platform: Platform.YOUTUBE, handle: 'PolicyDeepDiveMedia', displayName: 'Policy Analysis Stream', alias: 'Deep Dive Policy', role: 'Healthcare Policy Analyst', communityId: commCivic.id, verified: true, avatarColor: '#0891B2' },
    { platform: Platform.X, handle: '@CitizenActionWard7', displayName: 'Ward 7 Action Front', alias: 'Citizen Action Front', role: 'Civic Watchdog', communityId: commCivic.id, verified: false, avatarColor: '#0891B2' },
    { platform: Platform.X, handle: '@MedicalFrontVoice', displayName: 'Physicians Guild Dispatch', alias: 'Physicians Guild', role: 'Public Health Liaison', communityId: commCivic.id, verified: true, avatarColor: '#0891B2' },
    { platform: Platform.YOUTUBE, handle: 'UrbanTransitLive', displayName: 'Urban Transit Live Camera', alias: 'Live Camera Network', role: 'Traffic Streamer', communityId: commTransit.id, verified: false, avatarColor: '#2563EB' },
  ];

  const userRecords = [];

  for (let i = 0; i < anchorUserDefs.length; i++) {
    const def = anchorUserDefs[i];
    userRecords.push({
      id: `usr_${String(i + 1).padStart(3, '0')}`,
      platform: def.platform,
      platformUserId: `${def.platform.toLowerCase()}_user_${1000 + i}`,
      handle: def.handle,
      displayName: def.displayName,
      alias: def.alias,
      avatarColor: def.avatarColor,
      verified: def.verified,
      role: def.role,
      communityId: def.communityId,
      isSynthetic: true,
    });
  }

  const platformList = [Platform.X, Platform.TELEGRAM, Platform.REDDIT, Platform.YOUTUBE];
  const userRoles = [
    'Commuter Volunteer', 'Regional Passenger', 'Civic Observer', 'Transit Logistics Analyst',
    'Local Resident', 'Policy Commentator', 'Dispatch Reporter', 'Daily Commuter',
    'Community Marshal', 'Transport Union Delegate', 'Public Health Advocate', 'Route Coordinator'
  ];

  for (let i = 21; i <= 100; i++) {
    const platform = pickRandom(platformList);
    const comm = pickRandom(communities);
    let handle = '';
    let displayName = '';
    
    if (platform === Platform.X) {
      handle = `@commute_voice_${i}`;
      displayName = `Regional Commute Observer ${i}`;
    } else if (platform === Platform.TELEGRAM) {
      handle = `RegionalRelay_Group_${i}`;
      displayName = `Transit Bulletin Group ${i}`;
    } else if (platform === Platform.REDDIT) {
      handle = `u/metro_rider_${i}`;
      displayName = `Rider Perspective ${i}`;
    } else {
      handle = `TransitChannel_${i}`;
      displayName = `Mobility Dispatch Channel ${i}`;
    }

    userRecords.push({
      id: `usr_${String(i).padStart(3, '0')}`,
      platform,
      platformUserId: `${platform.toLowerCase()}_user_${1000 + i}`,
      handle,
      displayName,
      alias: `Observer ${i}`,
      avatarColor: comm.color,
      verified: random() > 0.75,
      role: pickRandom(userRoles),
      communityId: comm.id,
      isSynthetic: true,
    });
  }

  await prisma.user.createMany({ data: userRecords });
  const allUsers = await prisma.user.findMany({ where: { isSynthetic: true } });

  // 5. Create 1,000 Posts across 30 days with realistic topic lifecycles
  console.log('Seeding 1,000 Posts with realistic temporal, sentiment & topic curves...');
  
  const contentTemplatesByTopic: Record<string, string[]> = {
    'nar-01': [
      'All feeder routes connected to the Central interchange are effectively suspended. Feeder minibuses demanding 3x spot fares.',
      'Delegate committee has assembled outside the Transport Directorate for urgent tripartite deliberation. Rollback of surcharge demanded.',
      'Visuals from Terminal 3 show thousands stranded under heavy midday sun. Office workers forming spontaneous ride-share carpool circles.',
      'Depot 4 and 7 operators have ceased morning shifts. Alternate suburban trains running at 140% capacity.',
      'Private bus operators are taking advantage of the strike with massive surge pricing. Municipal oversight needed immediately.',
      'Volunteer marshals are helping elderly passengers at North Station navigate suburban rail alternatives.',
      'Union spokesperson says negotiations will resume at 15:00 UTC if fuel allowance indexation is guaranteed.',
      'Carpool coordination thread: 4 seats available from Western Tech Park to Central Metro Station. Leaving in 20 mins, zero charge.'
    ],
    'nar-02': [
      'The comparative analysis between Schedule A and B procurement shows a 14% gap in tier-2 clinic supply.',
      'Special livestream breakdown: Clause 14 of the new pharmaceutical procurement standard and regional distributor margins.',
      'Formal statement submitted to Health Ministry: Any revision to drug buffer stocks must protect pediatric formulary allocations first.',
      'Medical union delegates have raised concerns over decentralized warehouse inspection timelines.',
      'Civic healthcare forum report highlights potential delays in tier-3 district hospital medicine deliveries under new ordinance.'
    ],
    'nar-03': [
      'New segregated disposal trucks arrived at 07:45 sharp. Volunteer marshals helped educate household clusters on organic separation.',
      'Ward 7 waste route efficiency improved by 22% after secondary processing center opened this morning.',
      'Community meeting scheduled for Saturday to review neighborhood composting drop points.'
    ],
    'nar-04': [
      'High-speed fiber rollout completed in 8 suburban secondary schools today. Digital classroom equipment tests commencing.',
      'Teachers union welcomes smart classroom pilot but calls for comprehensive teacher training workshops.'
    ],
    'nar-05': [
      'Peer ride-sharing network has coordinated over 340 shared car trips along the East-West corridor during the transport stoppage.',
      'Volunteer carpool protocol expanded to include southern industrial belt. Join the regional Telegram relay.'
    ],
    'nar-06': [
      'Over 12,000 signatures collected for the anti-gouging petition demanding state caps on dynamic cab fares during transit emergencies.',
      'Regulatory committee will review surge pricing multipliers at next week transport authority hearing.'
    ],
    'nar-07': [
      'Automated signaling installation along the suburban rail corridor is now 65% complete. Weekend maintenance schedule posted.',
      'New train sets with regenerative braking systems arrive at the central maintenance depot for trial runs.'
    ],
    'nar-08': [
      'Smart meter peak tariff revision published: Off-peak rebates will apply from 22:00 to 06:00 for residential consumers.',
      'Audit report suggests smart meter calibration errors in northern district require prompt verification.'
    ]
  };

  const postRecords = [];
  const targetPostCount = 1000;

  for (let i = 1; i <= targetPostCount; i++) {
    const rTopic = random();
    let topic = topics[0]; // Strike
    let topicKey = 'nar-01';
    let daysAgo = randomBetween(0.01, 2.0);

    if (rTopic < 0.45) {
      topic = topics[0]; // Strike
      topicKey = 'nar-01';
      daysAgo = randomBetween(0.01, 1.8);
    } else if (rTopic < 0.65) {
      topic = topics[1]; // Healthcare
      topicKey = 'nar-02';
      daysAgo = randomBetween(0.1, 7.0);
    } else if (rTopic < 0.77) {
      topic = topics[4]; // Carpool
      topicKey = 'nar-05';
      daysAgo = randomBetween(0.05, 2.5);
    } else if (rTopic < 0.85) {
      topic = topics[5]; // Surge pricing
      topicKey = 'nar-06';
      daysAgo = randomBetween(0.2, 5.0);
    } else if (rTopic < 0.91) {
      topic = topics[2]; // Cleanliness
      topicKey = 'nar-03';
      daysAgo = randomBetween(1.0, 14.0);
    } else if (rTopic < 0.95) {
      topic = topics[3]; // Education
      topicKey = 'nar-04';
      daysAgo = randomBetween(2.0, 20.0);
    } else if (rTopic < 0.98) {
      topic = topics[6]; // Rail modernization
      topicKey = 'nar-07';
      daysAgo = randomBetween(3.0, 28.0);
    } else {
      topic = topics[7]; // Smart meters
      topicKey = 'nar-08';
      daysAgo = randomBetween(4.0, 29.0);
    }

    const createdAt = new Date(REF_TIMESTAMP - daysAgo * MS_PER_DAY);
    const author = pickRandom(allUsers);
    const platform = author.platform;

    let sentiment: SentimentType = SentimentType.NEUTRAL;
    let emotion: EmotionType = EmotionType.SUPPORTIVE;
    let sentimentScore = 0.0;
    let emotionScore = randomBetween(0.65, 0.98);

    if (topicKey === 'nar-01' || topicKey === 'nar-06') {
      const rSent = random();
      if (rSent < 0.68) {
        sentiment = SentimentType.NEGATIVE;
        emotion = rSent < 0.45 ? EmotionType.ANXIETY : EmotionType.OPPOSITION;
        sentimentScore = -randomBetween(0.4, 0.95);
      } else if (rSent < 0.86) {
        sentiment = SentimentType.NEUTRAL;
        emotion = EmotionType.SARCASM;
        sentimentScore = randomBetween(-0.1, 0.1);
      } else {
        sentiment = SentimentType.POSITIVE;
        emotion = EmotionType.SUPPORTIVE;
        sentimentScore = randomBetween(0.3, 0.85);
      }
    } else if (topicKey === 'nar-05' || topicKey === 'nar-03') {
      const rSent = random();
      if (rSent < 0.65) {
        sentiment = SentimentType.POSITIVE;
        emotion = EmotionType.SUPPORTIVE;
        sentimentScore = randomBetween(0.4, 0.9);
      } else if (rSent < 0.85) {
        sentiment = SentimentType.NEUTRAL;
        emotion = EmotionType.EXCITEMENT;
        sentimentScore = randomBetween(0.0, 0.2);
      } else {
        sentiment = SentimentType.NEGATIVE;
        emotion = EmotionType.ANXIETY;
        sentimentScore = -randomBetween(0.2, 0.6);
      }
    } else {
      const rSent = random();
      if (rSent < 0.45) {
        sentiment = SentimentType.NEUTRAL;
        emotion = EmotionType.OPPOSITION;
        sentimentScore = randomBetween(-0.15, 0.15);
      } else if (rSent < 0.75) {
        sentiment = SentimentType.NEGATIVE;
        emotion = EmotionType.OPPOSITION;
        sentimentScore = -randomBetween(0.3, 0.8);
      } else {
        sentiment = SentimentType.POSITIVE;
        emotion = EmotionType.EXCITEMENT;
        sentimentScore = randomBetween(0.3, 0.85);
      }
    }

    const templateList = contentTemplatesByTopic[topicKey] || ['Regional civic discussion update.'];
    const baseContent = pickRandom(templateList);
    const content = `${baseContent} [Ref #${i}]`;

    const likesCount = randomInt(5, platform === Platform.X ? 1200 : platform === Platform.YOUTUBE ? 650 : 400);
    const repostsCount = Math.round(likesCount * randomBetween(0.15, 0.5));
    const commentsCount = Math.round(likesCount * randomBetween(0.08, 0.35));
    const viewsCount = likesCount * randomInt(8, 25);
    const reachScore = parseFloat((randomBetween(3.5, 9.8)).toFixed(1));

    postRecords.push({
      id: `post_${String(i).padStart(5, '0')}`,
      platform,
      platformPostId: `${platform.toLowerCase()}_post_${10000 + i}`,
      authorId: author.id,
      content,
      topicId: topic.id,
      createdAt,
      collectedAt: new Date(createdAt.getTime() + randomInt(1, 15) * 60 * 1000),
      likesCount,
      repostsCount,
      commentsCount,
      viewsCount,
      reachScore,
      sentiment,
      sentimentScore,
      emotion,
      emotionScore,
      language: 'en',
      isSynthetic: true,
    });
  }

  await prisma.post.createMany({ data: postRecords });
  const createdPosts = await prisma.post.findMany({ where: { isSynthetic: true } });

  // 6. Create 2,500 Engagements
  console.log('Seeding 2,500 Engagements...');
  const engagementTypes = [
    EngagementType.LIKE,
    EngagementType.REPOST,
    EngagementType.REPLY,
    EngagementType.MENTION,
    EngagementType.QUOTE,
    EngagementType.SHARE,
  ];

  const engagementRecords = [];
  const targetEngagementCount = 2500;
  for (let i = 0; i < targetEngagementCount; i++) {
    const post = pickRandom(createdPosts);
    const actor = pickRandom(allUsers);
    const interactionType = pickRandom(engagementTypes);
    const engagementTime = new Date(post.createdAt.getTime() + randomInt(1, 120) * 60 * 1000);

    engagementRecords.push({
      id: `eng_${String(i + 1).padStart(5, '0')}`,
      postId: post.id,
      actorUserId: actor.id,
      targetUserId: post.authorId,
      interactionType,
      platform: post.platform,
      createdAt: engagementTime,
      isSynthetic: true,
    });
  }

  await prisma.engagement.createMany({ data: engagementRecords });

  // 7. Create 200 Network Graph Edges
  console.log('Seeding 200 Network Graph Edges with community & bridge structure...');
  const interactionTypes = [
    EngagementType.REPOST,
    EngagementType.REPLY,
    EngagementType.MENTION,
    EngagementType.QUOTE,
  ];

  const edgeSet = new Set<string>();
  const edgeRecords = [];
  const targetEdgeCount = 200;
  let edgesCreated = 0;

  for (let i = 0; i < targetEdgeCount * 4 && edgesCreated < targetEdgeCount; i++) {
    const isIntra = random() < 0.7;
    let source = pickRandom(allUsers);
    let target = pickRandom(allUsers);

    if (source.id === target.id) continue;

    if (isIntra && source.communityId) {
      const sameCommUsers = allUsers.filter((u) => u.communityId === source.communityId && u.id !== source.id);
      if (sameCommUsers.length > 0) {
        target = pickRandom(sameCommUsers);
      }
    }

    const pairKey = `${source.id}->${target.id}`;
    if (edgeSet.has(pairKey)) continue;
    edgeSet.add(pairKey);

    const platform = source.platform;
    const interactionType = pickRandom(interactionTypes);
    const weight = parseFloat(randomBetween(1.5, 5.8).toFixed(1));
    const occurredAt = new Date(REF_TIMESTAMP - randomBetween(0.1, 28) * MS_PER_DAY);

    edgeRecords.push({
      id: `edge_${String(edgesCreated + 1).padStart(4, '0')}`,
      sourceUserId: source.id,
      targetUserId: target.id,
      platform,
      interactionType,
      weight,
      occurredAt,
      isSynthetic: true,
    });

    edgesCreated++;
  }

  await prisma.networkEdge.createMany({ data: edgeRecords });

  // 8. Verification & Summary Output
  const userCount = await prisma.user.count({ where: { isSynthetic: true } });
  const postCount = await prisma.post.count({ where: { isSynthetic: true } });
  const topicCount = await prisma.topic.count({ where: { isSynthetic: true } });
  const communityCount = await prisma.community.count({ where: { isSynthetic: true } });
  const engagementCount = await prisma.engagement.count({ where: { isSynthetic: true } });
  const edgeCount = await prisma.networkEdge.count({ where: { isSynthetic: true } });

  console.log('\n==================================================');
  console.log('NEXUS database seeded successfully.');
  console.log('==================================================');
  console.log(`Communities:   ${communityCount}`);
  console.log(`Topics:        ${topicCount}`);
  console.log(`Users:         ${userCount}`);
  console.log(`Posts:         ${postCount}`);
  console.log(`Engagements:   ${engagementCount}`);
  console.log(`Network edges: ${edgeCount}`);
  console.log('==================================================\n');
}

main()
  .catch((e) => {
    console.error('Seed execution error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
