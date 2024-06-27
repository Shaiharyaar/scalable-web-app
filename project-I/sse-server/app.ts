import { Router, Application } from './deps.js';

const clients = new Map();
let uuid = '';
const app = new Application();
const router = new Router();

const deleteClient = (client, debug = '') => {
  for (const [key, value] of clients.entries()) {
    if (value == client) {
      console.log(debug);
      clients.delete(key);
      break;
    }
  }
};

router.get('/', (ctx) => {
  const user = ctx.request.url.searchParams.get('user');
  uuid = user;
  console.log(user);
  const target = ctx.sendEvents();

  clients.delete(user);
  clients.set(user, target);

  target.addEventListener('close', () => {
    deleteClient(target, 'del');
    console.log('Connection closed');
  });

  target.dispatchMessage({ hello: 'world' });
});

router.get('/ping', (ctx) => {
  const target = clients.get(uuid);
  target.dispatchMessage({ hello: 'MORORORORO' });
  return (ctx.response.status = 200);
});

app.use(router.routes());

await app.listen({ port: 5050, hostname: '0.0.0.0' });
