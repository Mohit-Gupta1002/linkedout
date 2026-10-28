import http from 'node:http';

const routes = [
  '/',
  '/feed',
  '/explore',
  '/communities',
  '/communities/ai-machine-learning',
  '/my-communities',
  '/companies',
  '/companies/razorcloud-systems',
  '/discussions/disc_1',
  '/messages',
  '/notifications',
  '/settings',
  '/share-experience',
  '/profile/aarav_sharma',
  '/auth/sign-in',
  '/auth/sign-up',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/onboarding'
];

async function checkRoute(route) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${route}`, (res) => {
      resolve({ route, statusCode: res.statusCode });
    }).on('error', (err) => {
      reject({ route, error: err.message });
    });
  });
}

async function checkPost(route, data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const req = http.request(
      `http://localhost:3000${route}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      },
      (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            resolve({ statusCode: res.statusCode, body: JSON.parse(body) });
          } catch {
            resolve({ statusCode: res.statusCode, body });
          }
        });
      }
    );
    req.on('error', (err) => reject(err));
    req.write(payload);
    req.end();
  });
}

async function run() {
  console.log('--- Verifying LinkedOut Live Endpoints ---');
  let failed = 0;
  for (const r of routes) {
    try {
      const res = await checkRoute(r);
      if (res.statusCode === 200) {
        console.log(`[PASS 200] ${r}`);
      } else {
        console.error(`[FAIL ${res.statusCode}] ${r}`);
        failed++;
      }
    } catch (e) {
      console.error(`[ERROR] ${r}: ${e.error}`);
      failed++;
    }
  }

  console.log('\n--- Verifying Server-Side 18+ Age Validation API ---');
  // 1. Underage test: age 16 must be rejected with 403
  try {
    const underRes = await checkPost('/api/auth/validate-age', {
      displayName: 'Teen Coder',
      username: 'teen_coder',
      age: 16
    });
    if (underRes.statusCode === 403 && underRes.body.eligible === false) {
      console.log('[PASS 403] /api/auth/validate-age (Underage age: 16 properly rejected)');
    } else {
      console.error(`[FAIL] Underage test expected 403, got ${underRes.statusCode}`, underRes.body);
      failed++;
    }
  } catch (e) {
    console.error('[ERROR] Underage test failed:', e.message);
    failed++;
  }

  // 2. Adult test: age 22 must be accepted with 200
  try {
    const adultRes = await checkPost('/api/auth/validate-age', {
      displayName: 'Adult Engineer',
      username: 'adult_eng',
      age: 22
    });
    if (adultRes.statusCode === 200 && adultRes.body.eligible === true) {
      console.log('[PASS 200] /api/auth/validate-age (Adult age: 22 properly verified)');
    } else {
      console.error(`[FAIL] Adult test expected 200, got ${adultRes.statusCode}`, adultRes.body);
      failed++;
    }
  } catch (e) {
    console.error('[ERROR] Adult test failed:', e.message);
    failed++;
  }

  // 3. Missing required field test: missing display name must return 400
  try {
    const missingRes = await checkPost('/api/auth/validate-age', {
      displayName: '',
      username: 'noname',
      age: 20
    });
    if (missingRes.statusCode === 400) {
      console.log('[PASS 400] /api/auth/validate-age (Missing required display_name rejected)');
    } else {
      console.error(`[FAIL] Missing field test expected 400, got ${missingRes.statusCode}`);
      failed++;
    }
  } catch (e) {
    console.error('[ERROR] Missing field test failed:', e.message);
    failed++;
  }

  if (failed === 0) {
    console.log(`\nAll ${routes.length} HTTP routes and all Server-Side Age Verification API checks passed!`);
    process.exit(0);
  } else {
    console.error(`\n${failed} checks failed!`);
    process.exit(1);
  }
}

run();

