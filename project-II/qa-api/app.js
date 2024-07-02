import { Application, createClient } from './deps.js';
import assignmentRouter from './routers/questions.js';

// initiating redis client for stream
export const client = createClient({
  url: 'redis://redis:6379',
  pingInterval: 1000,
});

await client.connect();

const app = new Application();

app.use(async ({ request, state }, next) => {
  console.log('hit');
  state.user = request.headers.get('Authorization');
  await next();
});

app.use(assignmentRouter.routes());

await app.listen({ port: 7777, hostname: '0.0.0.0' });

// import { serve } from './deps.js';

// const handleRequest = async (request) => {
//   const data = await request.json();

//   const response = await fetch('http://llm-api:7000/', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//   });

//   return response;
// };

// const portConfig = { port: 7777, hostname: '0.0.0.0' };
// serve(handleRequest, portConfig);
