import postgres from 'https://deno.land/x/postgresjs@v3.4.4/mod.js';

const portConfig = { port: 7777 };

const sql = postgres({});

const handleGetRoot = async (request) => {
  return new Response('Hello world at root!');
};

const handleGetTodo = async (request, urlPatternResult) => {
  const id = urlPatternResult.pathname.groups.id;
  const todos = await sql`SELECT * FROM todos WHERE id = ${id}`;

  if (todos.length === 0) {
    return new Response('Todo not found', { status: 404 });
  }

  return new Response(JSON.stringify(todos[0]), {
    headers: { 'Content-Type': 'application/json' },
  });
};

const handleGetTodos = async (request) => {
  const todos = await sql`SELECT * FROM todos`;
  console.log({ todos });
  return new Response(JSON.stringify(todos), {
    headers: { 'Content-Type': 'application/json' },
  });
};

const handlePostTodos = async (request) => {
  try {
    const data = await request.json();
    if (!data.todo) {
      throw new Error("Invalid data: 'todo' field is required.");
    }

    await sql`INSERT INTO todos (todo) VALUES (${data.todo})`;
    return new Response('Todo added successfully', { status: 200 });
  } catch (error) {
    return new Response(error.message, { status: 400 });
  }
};

const handleDeleteTodo = async (request, urlPatternResult) => {
  try {
    const id = urlPatternResult.pathname.groups.id;
    if (!id) {
      throw new Error("Invalid request: 'id' is required.");
    }

    const result = await sql`DELETE FROM todos WHERE id = ${id} RETURNING *`;

    if (result.length === 0) {
      return new Response('Todo not found', { status: 404 });
    }

    return new Response('Todo deleted successfully', { status: 200 });
  } catch (error) {
    return new Response(error.message, { status: 400 });
  }
};

const urlMapping = [
  {
    method: 'GET',
    pattern: new URLPattern({ pathname: '/todos/:id' }),
    fn: handleGetTodo,
  },
  {
    method: 'GET',
    pattern: new URLPattern({ pathname: '/todos' }),
    fn: handleGetTodos,
  },
  {
    method: 'POST',
    pattern: new URLPattern({ pathname: '/todos' }),
    fn: handlePostTodos,
  },
  {
    method: 'GET',
    pattern: new URLPattern({ pathname: '/' }),
    fn: handleGetRoot,
  },
  {
    method: 'DELETE',
    pattern: new URLPattern({ pathname: '/todos/:id' }),
    fn: handleDeleteTodo,
  },
];
const handleRequest = async (request) => {
  console.log(`Received ${request.method} request for ${request.url}`);
  const mapping = urlMapping.find(
    (um) => um.method === request.method && um.pattern.test(request.url)
  );

  if (!mapping) {
    return new Response('Not found', { status: 404 });
  }

  const mappingResult = mapping.pattern.exec(request.url);
  console.log(`Matching pattern found: ${mapping.pattern.pathname}`);
  try {
    return await mapping.fn(request, mappingResult);
  } catch (e) {
    console.log(e);
    return new Response(e.stack, { status: 500 });
  }
};

Deno.serve(portConfig, handleRequest);
