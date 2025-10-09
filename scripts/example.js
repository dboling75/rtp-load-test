import http from 'k6/http';
import { sleep, check } from 'k6';

const BASE = __ENV.BASE_URL || 'https://test.k6.io';
const AUTH = __ENV.AUTH_TOKEN || '';
const LOG_LEVEL = __ENV.LOG_LEVEL || 'normal';

const stagesEnv = (__ENV.STAGES || '').trim();
let stages = [];
if (stagesEnv) {
  stages = stagesEnv.split(',').map(s => {
    const [dur, tgt] = s.split(':').map(x => x.trim());
    return { duration: dur, target: parseInt(tgt, 10) };
  });
}

export const options = stages.length
  ? { stages,
      thresholds: {
        http_req_duration: [`p(95)<${__ENV.THRESHOLD_HTTP_REQ_DURATION_P95 || 500}`],
      } }
  : { vus: __ENV.VUS ? parseInt(__ENV.VUS, 10) : 5,
      duration: __ENV.DURATION || '20s',
      thresholds: {
        http_req_duration: [`p(95)<${__ENV.THRESHOLD_HTTP_REQ_DURATION_P95 || 500}`],
      } };

export default function () {
  const headers = AUTH ? { Authorization: `Bearer ${AUTH}` } : {};
  const res = http.get(BASE, { headers });

  if (LOG_LEVEL === 'debug') {
    console.log(`Status: ${res.status} | TTFB: ${res.timings.waiting}ms`);
  }

  check(res, { 'status is 200': (r) => r.status === 200 });
  const sleepDur = (__ENV.SLEEP_DURATION || '1s').replace('s', '');
  sleep(parseFloat(sleepDur));
}
