import http from 'k6/http'; import { sleep, check } from 'k6';
export const options = { vus: __ENV.VUS ? parseInt(__ENV.VUS,10) : 5, duration: __ENV.DURATION || '20s'};
export default function(){ const r=http.get(__ENV.BASE_URL||'https://test.k6.io'); check(r,{ '200':(x)=>x.status===200 }); sleep(parseFloat((__ENV.SLEEP_DURATION||'1s').replace('s',''))); }