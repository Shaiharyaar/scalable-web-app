import http from 'k6/http';

export const options = {
  vus: 1,
  iterations: 20,
  summaryTrendStats: ['med', 'p(99)'],
};

export default function () {
  http.post(
    'http://localhost:7800/todos',
    JSON.stringify({ item: 'hamburger' })
  );
}
