import { app } from './src/app';
import { prisma } from './src/db/prisma';
import http from 'http';

async function runPhase3FAudit() {
  console.log('================================================================');
  console.log('NEXUS PHASE 3F: AUDIENCE & PROFILE ACCESS AUDIT & VERIFICATION');
  console.log('================================================================\n');

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  const address = server.address() as { port: number };
  const baseUrl = `http://127.0.0.1:${address.port}`;
  console.log(`Ephemeral test server running at ${baseUrl}\n`);

  async function request(path: string, options: RequestInit = {}) {
    const res = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    const json = await res.json();
    return { status: res.status, ok: res.ok, data: json };
  }

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string, detail?: any) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`✅ [PASS] ${testName}`);
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      if (detail) console.error('   Detail:', detail);
    }
  }

  try {
    // ----------------------------------------------------
    // TEST 1: Initial Profile & Roles
    // ----------------------------------------------------
    console.log('--- TEST GROUP 1: PROFILE & ROLE PERMISSIONS ---');
    const profRes = await request('/api/profile');
    assert(profRes.status === 200, 'GET /api/profile returns 200 OK');
    assert(profRes.data.role === 'lead_analyst', 'Default role is lead_analyst');
    assert(profRes.data.permissions.canConfirmSignal === true, 'lead_analyst canConfirmSignal is true');
    assert(profRes.data.permissions.canVerifyRecord === true, 'lead_analyst canVerifyRecord is true');
    assert(profRes.data.permissions.canViewIntelligence === true, 'lead_analyst canViewIntelligence is true');

    // ----------------------------------------------------
    // TEST 2: Role Switch to Viewer
    // ----------------------------------------------------
    console.log('\n--- TEST GROUP 2: ROLE SWITCH TO VIEWER ---');
    const switchRes = await request('/api/profile/role', {
      method: 'POST',
      body: JSON.stringify({ role: 'viewer' }),
    });
    assert(switchRes.status === 200, 'POST /api/profile/role (viewer) returns 200 OK');
    assert(switchRes.data.role === 'viewer', 'Profile role updated to viewer');
    assert(switchRes.data.permissions.canConfirmSignal === false, 'viewer canConfirmSignal is FALSE');
    assert(switchRes.data.permissions.canVerifyRecord === false, 'viewer canVerifyRecord is FALSE');
    assert(switchRes.data.permissions.canViewIntelligence === true, 'viewer canViewIntelligence is TRUE (read access preserved)');

    // ----------------------------------------------------
    // TEST 3: Viewer Authorization Enforcement (Must be 403 Forbidden)
    // ----------------------------------------------------
    console.log('\n--- TEST GROUP 3: SERVER-SIDE AUTHORIZATION: VIEWER REJECTION ---');
    
    // Viewer attempts to confirm signal
    const viewerConfirm = await request('/api/signals/confirm', {
      method: 'POST',
      headers: { 'x-user-role': 'viewer' },
      body: JSON.stringify({ signalId: 'nar-01' }),
    });
    assert(viewerConfirm.status === 403, 'POST /api/signals/confirm rejects viewer with 403 Forbidden');
    assert(viewerConfirm.data.allowed === false, 'Response payload explicitly states allowed: false');
    assert(viewerConfirm.data.code === 'ROLE_UNAUTHORIZED', 'Response contains ROLE_UNAUTHORIZED error code');

    // Viewer attempts to verify record
    const viewerVerify = await request('/api/records/verify', {
      method: 'POST',
      headers: { 'x-user-role': 'viewer' },
      body: JSON.stringify({ recordId: 'post_00001' }),
    });
    assert(viewerVerify.status === 403, 'POST /api/records/verify rejects viewer with 403 Forbidden');
    assert(viewerVerify.data.allowed === false, 'Response payload explicitly states allowed: false');

    // Viewer attempts via overview/timeline alias routes
    const viewerOverviewConfirm = await request('/api/overview/confirm-signal', {
      method: 'POST',
      headers: { 'x-user-role': 'viewer' },
      body: JSON.stringify({ signalId: 'nar-02' }),
    });
    assert(viewerOverviewConfirm.status === 403, 'POST /api/overview/confirm-signal rejects viewer with 403 Forbidden');

    const viewerTimelineVerify = await request('/api/timeline/verify-record', {
      method: 'POST',
      headers: { 'x-user-role': 'viewer' },
      body: JSON.stringify({ recordId: 'post_00002' }),
    });
    assert(viewerTimelineVerify.status === 403, 'POST /api/timeline/verify-record rejects viewer with 403 Forbidden');

    // ----------------------------------------------------
    // TEST 4: Viewer Retains Full Read Permissions
    // ----------------------------------------------------
    console.log('\n--- TEST GROUP 4: VIEWER PERMITTED READ ACCESS ---');
    const [ovRes, tlRes, sentRes, trRes, netRes] = await Promise.all([
      request('/api/overview', { headers: { 'x-user-role': 'viewer' } }),
      request('/api/timeline', { headers: { 'x-user-role': 'viewer' } }),
      request('/api/sentiment', { headers: { 'x-user-role': 'viewer' } }),
      request('/api/trends', { headers: { 'x-user-role': 'viewer' } }),
      request('/api/network', { headers: { 'x-user-role': 'viewer' } }),
    ]);
    assert(ovRes.status === 200, 'Viewer permitted GET /api/overview (200 OK)');
    assert(tlRes.status === 200, 'Viewer permitted GET /api/timeline (200 OK)');
    assert(sentRes.status === 200, 'Viewer permitted GET /api/sentiment (200 OK)');
    assert(trRes.status === 200, 'Viewer permitted GET /api/trends (200 OK)');
    assert(netRes.status === 200, 'Viewer permitted GET /api/network (200 OK)');

    // ----------------------------------------------------
    // TEST 5: Analyst Authorization (Must Succeed with 200 OK)
    // ----------------------------------------------------
    console.log('\n--- TEST GROUP 5: ANALYST AUTHORIZATION EXECUTION ---');
    // Fetch a real sample post from DB to verify
    const samplePost = await prisma.post.findFirst({ select: { id: true, platformPostId: true } });
    assert(samplePost !== null, 'Sample post exists in database');

    const analystConfirm = await request('/api/signals/confirm', {
      method: 'POST',
      headers: { 'x-user-role': 'lead_analyst' },
      body: JSON.stringify({ signalId: 'nar-01' }),
    });
    assert(analystConfirm.status === 200, 'lead_analyst POST /api/signals/confirm returns 200 OK');
    assert(analystConfirm.data.status === 'confirmed', 'Signal status is confirmed');
    assert(analystConfirm.data.confirmedBy === 'lead_analyst', 'Confirmed by lead_analyst recorded');

    const analystVerify = await request('/api/records/verify', {
      method: 'POST',
      headers: { 'x-user-role': 'analyst' },
      body: JSON.stringify({ recordId: samplePost?.id }),
    });
    assert(analystVerify.status === 200, 'analyst POST /api/records/verify returns 200 OK');
    assert(analystVerify.data.status === 'verified', 'Record status is verified');

    // ----------------------------------------------------
    // TEST 6: Audience Data Truth Check
    // ----------------------------------------------------
    console.log('\n--- TEST GROUP 6: AUDIENCE DATABASE TRUTH ---');
    const overviewData = ovRes.data;
    assert(overviewData.audience !== undefined, 'Overview contains audience object');
    assert(Array.isArray(overviewData.audience.languages), 'audience.languages is array');
    assert(overviewData.audience.languages.length > 0, 'audience.languages has real entries');
    assert(overviewData.audience.languages[0].language === 'English (en)', 'Primary language is English (en) from DB');
    assert(Array.isArray(overviewData.audience.regions), 'audience.regions is array');
    assert(overviewData.audience.regions.length > 0, 'audience.regions contains community cohorts');
    assert(Array.isArray(overviewData.audience.ageGroups) && overviewData.audience.ageGroups.length === 0, 'Demographics are unmodeled (zero fake data)');

    console.log('\n================================================================');
    console.log(`PHASE 3F AUDIT COMPLETE: ${passedTests}/${totalTests} TESTS PASSED`);
    console.log('================================================================');

    if (passedTests === totalTests) {
      console.log('🎉 ALL ACCESS, AUTHORIZATION, AND AUDIENCE CONTRACTS VERIFIED!');
    } else {
      console.error('⚠️ SOME TESTS FAILED. PLEASE REVIEW LOGS.');
    }
  } finally {
    server.close();
  }
}

runPhase3FAudit().catch((err) => {
  console.error('Fatal audit failure:', err);
  process.exit(1);
});
