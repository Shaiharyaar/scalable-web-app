import { serve } from './deps.js';
import { grade } from './services/gradingService.js';

const handleRequest = async (request) => {
  // get json obj of request
  const requestData = await request.json();

  console.log('Request data:');
  console.log(requestData);

  const code = requestData.code;
  const testCode = requestData.testCode;

  const result = await grade(code, testCode);

  return new Response(JSON.stringify({ result: result }));
};

const portConfig = { port: 7000, hostname: '0.0.0.0' };
serve(handleRequest, portConfig);
