import { Router, Application, ServerSentEvent } from './deps.js';

const clients = new Map();
const app = new Application();
const router = new Router();

const questionWorker = new Worker(
  new URL('./workers/question.js', import.meta.url),
  {
    type: 'module',
  }
);

questionWorker.postMessage('Question worker service Start');

questionWorker.onmessage = ({ data }) => {
  for (const [userId, target] of clients.entries()) {
    if (userId === data.user) {
      const message = new ServerSentEvent('question_submission', {
        data: {
          ...data,
          shouldUpdateQuestions: true,
        },
      });
      target?.dispatchEvent(message);
    } else {
      const { user, ...questionData } = data;
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

const answerWorker = new Worker(
  new URL('./workers/answer.js', import.meta.url),
  {
    type: 'module',
  }
);

answerWorker.postMessage('Answer worker service Start');

answerWorker.onmessage = ({ data }) => {
  for (const [userId, target] of clients.entries()) {
    if (userId === data.user) {
      const message = new ServerSentEvent('answer_submission', {
        data: {
          ...data,
          shouldUpdateAnswers: true,
        },
      });
      target?.dispatchEvent(message);
    } else {
      const { user, ...answerData } = data;
      const message = new ServerSentEvent('answer_submission', {
        data: {
          ...answerData,
          shouldUpdateAnswers: true,
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
