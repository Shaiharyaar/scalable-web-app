import postgres from 'https://deno.land/x/postgresjs@v3.4.2/mod.js';

const portConfig = { port: 7777 };

const sql = postgres({});

const handleGetRoot = async (request) => {
  return new Response('Hello world at root!');
};

const handleGetItem = async (request, urlPatternResult) => {
  const id = urlPatternResult.pathname.groups.id;
  const todos = await sql`SELECT * FROM todos WHERE id = ${id}`;

  if (todos.length === 0) {
    return new Response('Todo not found', { status: 404 });
  }

  return new Response(JSON.stringify(todos[0]), {
    headers: { 'Content-Type': 'application/json' },
  });
};

const handleGetItems = async (request) => {
  const todos = await sql`SELECT * FROM todos`;
  return new Response(JSON.stringify(todos), {
    headers: { 'Content-Type': 'application/json' },
  });
};

const handlePostItems = async (request) => {
  try {
    const data = await request.json();
    if (!data.item) {
      throw new Error("Invalid data: 'item' field is required.");
    }

    await sql`INSERT INTO todos (item) VALUES (${data.item})`;
    return new Response('Todo added successfully', { status: 200 });
  } catch (error) {
    return new Response(error.message, { status: 400 });
  }
};

const urlMapping = [
  {
    method: 'GET',
    pattern: new URLPattern({ pathname: '/todos/:id' }),
    fn: handleGetItem,
  },
  {
    method: 'GET',
    pattern: new URLPattern({ pathname: '/todos' }),
    fn: handleGetItems,
  },
  {
    method: 'POST',
    pattern: new URLPattern({ pathname: '/todos' }),
    fn: handlePostItems,
  },
  {
    method: 'GET',
    pattern: new URLPattern({ pathname: '/' }),
    fn: handleGetRoot,
  },
];

const handleRequest = async (request) => {
  const mapping = urlMapping.find(
    (um) => um.method === request.method && um.pattern.test(request.url)
  );

  if (!mapping) {
    return new Response('Not found', { status: 404 });
  }

  const mappingResult = mapping.pattern.exec(request.url);
  return await mapping.fn(request, mappingResult);
};

const handleHttpConnection = async (conn) => {
  for await (const requestEvent of Deno.serveHttp(conn)) {
    requestEvent.respondWith(await handleRequest(requestEvent.request));
  }
};

Deno.serve(portConfig, handleHttpConnection);
