import * as todoService from './services/todoService.js';
import { cacheMethodCalls } from './utils/cacheUtil.js';

const portConfig = { port: 7777 };

const cachedTodoService = cacheMethodCalls(todoService, [
  'addItem',
  'deleteItem',
]);

const handleGetRoot = async (request) => {
  return new Response('Hello world at root!');
};

const handleGetItem = async (request, urlPatternResult) => {
  const id = urlPatternResult.pathname.groups.id;
  const todos = await cachedTodoService.getItem(id);

  if (todos.length === 0) {
    return new Response('Todo not found', { status: 404 });
  }

  return new Response(JSON.stringify(todos[0]), {
    headers: { 'Content-Type': 'application/json' },
  });
};

const handleGetItems = async (request) => {
  const todos = await cachedTodoService.getItems();
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

    await cachedTodoService.addItem(data.item);
    return new Response('Todo added successfully', { status: 200 });
  } catch (error) {
    return new Response(error.message, { status: 400 });
  }
};

const handleDeleteItems = async (request, urlPatternResult) => {
  try {
    const id = urlPatternResult.pathname.groups.id;
    if (!id) {
      throw new Error("Invalid request: 'id' is required.");
    }

    const result = await cachedTodoService.deleteItem(id);

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
  {
    method: 'DELETE',
    pattern: new URLPattern({ pathname: '/todos/:id' }),
    fn: handleDeleteItems,
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
  try {
    return await mapping.fn(request, mappingResult);
  } catch (e) {
    // wrong route handling
    console.log(e);
    return new Response(e.stack, { status: 500 });
  }
};

Deno.serve(portConfig, handleRequest);
