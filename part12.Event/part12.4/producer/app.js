import { createClient } from 'npm:redis@4.6.4';
import { serve } from 'https://deno.land/std@0.222.1/http/server.ts';

const client = createClient({
  url: 'redis://redis:6379',
  pingInterval: 1000,
});

await client.connect();

const handleRequest = async (request) => {
  const url = new URL(request.url);
  client.publish(
    'public-channel',
    `producer accessed with pathname "${url.pathname}"`
  );
  if (url.pathname == '/publish') {
    client.publish('secret-channel', 'hello!');
    return new Response('Data published!');
  }

  return new Response('Hello!');
};

serve(handleRequest, { port: 7777 });
