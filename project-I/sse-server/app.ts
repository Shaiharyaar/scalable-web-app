import { Router, Application, ServerSentEvent } from './deps.js';

const clients = new Map();
const app = new Application();
const router = new Router();

const worker = new Worker(new URL('./worker.js', import.meta.url), {
  type: 'module',
});

worker.postMessage('Start');

worker.onmessage = ({ data }) => {
  console.log({ data });
  const target = clients.get(data.user_uuid);
  const message = new ServerSentEvent('submission_results', { data });
  target?.dispatchEvent(message);
};

router.get('/', (ctx) => {
  const user = ctx.request.url.searchParams.get('user');
  console.log(user);
  const target = ctx.sendEvents();

  clients.delete(user);
  clients.set(user, target);

  target.addEventListener('close', () => {
    console.log('Connection closed');
  });

  const e = new ServerSentEvent('init', { data: 'hello from server' });

  target.dispatchEvent(e);
});

app.use(router.routes());

await app.listen({ port: 5050, hostname: '0.0.0.0' });
