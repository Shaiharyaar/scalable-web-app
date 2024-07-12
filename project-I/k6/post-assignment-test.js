import { check } from 'k6';
import http from 'k6/http';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

export const options = {
  vus: 1,
  iterations: 20,
  summaryTrendStats: ['med', 'p(99)'],
};

export default function () {
  const randomUUID = uuidv4();
  const payload = {
    assignmentNumber: 1,
    code: 'def hello():\n\treturn "Hello";',
  };
  const params = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: randomUUID,
    },
  };
  check(
    http.post(
      'http://localhost:7800/api/submissions',
      JSON.stringify(payload),
      params
    ),
    {
      'is status 200': (r) => r.status === 200,
    }
  );
}
