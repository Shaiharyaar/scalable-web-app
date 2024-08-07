import { Application, createClient } from './deps.js';
import assignmentRouter from './routers/assignmentRouter.js';

// initiating redis client for stream
export const client = createClient({
  url: 'redis://redis:6379',
  pingInterval: 1000,
});

await client.connect();

const app = new Application();

app.use(async ({ request, state }, next) => {
  const userId = request.headers.get('Authorization');
  if (!userId) {
    return (response.status = 401);
  }
  state.user = userId;
  await next();
});

app.use(assignmentRouter.routes());

await app.listen({ port: 7777, hostname: '0.0.0.0' });
