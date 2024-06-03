import http from 'k6/http';

export const options = {
  duration: '10s',
  vus: 10,
  summaryTrendStats: ['med', 'p(99)'],
};

export default function () {
  http.get('http://localhost:7800/todos');
}

export function handleSummary(data) {
  // Access the median request duration from the summary object
  const medianRequestDuration = data.metrics.http_req_duration.median;

  // Print or log the median request duration
  console.log('Median request duration:', medianRequestDuration);
}
