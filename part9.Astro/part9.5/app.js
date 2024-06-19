const cache = new Map();

const handleRequest = async (request) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return new Response("Phew, it took quite some time!");
};

const handleRequestWithCache = async (request) => {
  const key = `${request.method}-${request.url}`;
  if (cache.has(key)) {
    return cache.get(key).clone();
  }

  const response = await handleRequest(request);
  cache.set(key, response.clone());
  return response;
};

const portConfig = { port: 7777, hostname: "0.0.0.0" };
Deno.serve(portConfig, handleRequestWithCache);
