import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
const PATH = __ENV.ENDPOINT_PATH || '/health';
const AUTH_MODE = (__ENV.AUTH_MODE || 'none').toLowerCase();

const RATE = Number(__ENV.RATE || 2);
const DURATION = __ENV.DURATION || '30s';
const THRESHOLD_P90 = Number(__ENV.THRESHOLD_P90 || 2000);
const ERROR_RATE_MAX = Number(__ENV.ERROR_RATE_MAX || 0.05);

let TOKEN = __ENV.TOKEN || '';
try {
  if (!TOKEN) {
    TOKEN = open('secrets/token.txt').trim();
  }
} catch (e) {}

const smoke_duration = new Trend('smoke_req_duration');

export const options = {
  scenarios: {
    smoke: {
      executor: 'constant-arrival-rate',
      rate: RATE,
      timeUnit: '1s',
      duration: DURATION,
      preAllocatedVUs: Math.max(10, RATE * 2),
      maxVUs: Math.max(50, RATE * 5),
      exec: 'main',
    },
  },
  thresholds: {
    http_req_duration: [`p(90)<${THRESHOLD_P90}`],
    http_req_failed: [`rate<${ERROR_RATE_MAX}`],
  },
  tags: { test: 'rtp-smoke' },
};

export function main() {
  const url = `${BASE_URL}${PATH}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(AUTH_MODE === 'bearer' && TOKEN ? { 'Authorization': `Bearer ${TOKEN}` } : {}),
  };
  const res = http.get(url, { headers, tags: { endpoint: `GET ${PATH}` } });
  smoke_duration.add(res.timings.duration);
  check(res, {
    'status is 2xx/3xx': (r) => r.status >= 200 && r.status < 400,
  });
  sleep(0.2);
}

export function handleSummary(data) {
  return {
    '/results/summary.json': JSON.stringify(data, null, 2),
    stdout: `\n== Smoke Summary ==\nP90: ${data.metrics.http_req_duration['p(90)']} ms\nErrors: ${data.metrics.http_req_failed.rate}\nIterations: ${data.metrics.iterations.count}\n`
  };
}
