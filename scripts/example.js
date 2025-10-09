import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 5,
  duration: '20s',
};

export default function () {
  const res = http.get('https://test.k6.io/');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'ttfb < 500ms': (r) => r.timings.waiting < 500,
  });
  sleep(1);
}
