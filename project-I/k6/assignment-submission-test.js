import http from 'k6/http';

export const options = {
  vus: 1,
  iterations: 20,
  summaryTrendStats: ['med', 'p(99)'],
};

export default function () {
  http.post(
    'http://localhost:7800/submission',
    JSON.stringify({
      id: 1,
      title: 'Hello',
      assignment_order: 1,
      handout: 'Write a function "hello" that returns the string "Hello"',
      test_code:
        'import socket\n' +
        'def guard(*args, **kwargs):\n' +
        '  raise Exception("Internet is bad for you :|")\n' +
        'socket.soc',
    })
  );
}
