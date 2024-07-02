import { check } from 'k6';
import http from 'k6/http';

export const options = {
  vus: 1,
  iterations: 20,
  summaryTrendStats: ['med', 'p(99)'],
};
let user = 'unique-user-uuid';

export default function () {
  const payload = {
    assignmentNumber: 1,
    code: 'def hello():\n\treturn "Hello";',
  };
  const params = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: user,
    },
  };
  check(
    http.post('http://localhost:7800/api/submissions', JSON.stringify(payload)),
    {
      'is status 200': (r) => r.status === 200,
    }
  );
}
