import { Router } from '../deps.js';
import * as questionService from '../services/questions.js';
import { cacheMethodCalls } from '../utils/cacheUtil.js';
// import { client } from '../app.js';

const router = new Router();

const questionCachedService = cacheMethodCalls(questionService, []);

router.get('/questions', async ({ response, state }) => {
  const { user } = state;
  const questions = await questionCachedService.getAllSorted(user);
  response.body = questions;
});

export default router;
