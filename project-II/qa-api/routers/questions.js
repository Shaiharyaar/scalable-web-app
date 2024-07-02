import { Router } from '../deps.js';
import * as questionService from '../services/questions.js';
import * as answerService from '../services/answers.js';
import { cacheMethodCalls } from '../utils/cacheUtil.js';
// import { client } from '../app.js';

const router = new Router();

const questionCachedService = cacheMethodCalls(questionService, []);

router.get('/questions', async ({ response, state }) => {
  const { user } = state;
  const questions = await questionService.getAllSorted('uuid2');
  response.body = questions;
});
router.get('/answers', async ({ request, response }) => {
  const body = request.body({ type: 'json' });
  const { questionId } = body;
  const answers = await answerService.getAllSorted(questionId);
  response.body = answers;
});

export default router;
