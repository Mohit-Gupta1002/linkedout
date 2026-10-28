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

  if (failed === 0) {
    console.log(`\nAll ${routes.length} HTTP routes successfully returned 200 OK!`);
    process.exit(0);
  } else {
    console.error(`\n${failed} routes failed!`);
    process.exit(1);
  }
}

run();
