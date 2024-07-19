import { check } from 'k6';
import http from 'k6/http';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

export const options = {
  duration: '10s',
  vus: 10,
  summaryTrendStats: ['med', 'p(99)'],
};

export default function () {
  const randomUUID = uuidv4();
  const params = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: randomUUID,
    },
  };
  check(http.get('http://localhost:7800/api/questions/20', params), {
    'is status 200': (r) => r.status === 200,
  });
}
