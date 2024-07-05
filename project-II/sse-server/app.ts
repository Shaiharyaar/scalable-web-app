import { Router, Application, ServerSentEvent } from './deps.js';

const clients = new Map();
const app = new Application();
const router = new Router();

const worker = new Worker(new URL('./worker.js', import.meta.url), {
  type: 'module',
});

worker.postMessage('Start');

worker.onmessage = ({ data }) => {
  for (const [user, target] of clients.entries()) {
    if (user === data.user) {
      const message = new ServerSentEvent('question_submission', {
        data: {
          ...data,
          shouldUpdateQuestions: true,
        },
      });
      target?.dispatchEvent(message);
    } else {
      const { questionId, ...questionData } = data;
      const message = new ServerSentEvent('question_submission', {
        data: {
          ...questionData,
          shouldUpdateQuestions: true,
        },
      });
      target?.dispatchEvent(message);
    }
  }
};

router.get('/', (ctx) => {
  const user = ctx.request.url.searchParams.get('user');
  if (!user) {
    ctx.throw(400, 'User parameter is required');
  }
  console.log(user);
  const target = ctx.sendEvents();

  clients.delete(user);
  clients.set(user, target);

  const e = new ServerSentEvent('init', { data: 'Server has started!' });
  target.dispatchEvent(e);

  target.addEventListener('close', () => {
    console.log('Connection closed');
  });
});

app.use(router.routes());
await app.listen({ port: 5050, hostname: '0.0.0.0' });
