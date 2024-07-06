import { Router } from '../deps.js';
import { client } from '../app.js';
import * as questionService from '../services/questions.js';
// import { questionService } from '../utils/cacheUtil.js';

const router = new Router();

router.get('/questions', async ({ response, state }) => {
  const { user } = state;
  const questions = await questionService.getAllSorted(user);
  response.body = questions;
});

router.post('/questions', async ({ request, response, state }) => {
  const body = request.body({ type: 'json' });
  const { title, text } = await body.value;
  const { user } = state;

  let questionId = await questionService.addQuestion(user, title, text);

  if (questionId.length === 0) return;
  questionId = questionId[0].question_id;

  const data = {
    user,
    title,
    text,
    questionId: `${questionId}`,
    questionAdded: 'true',
    feedback: 'Question has been added',
  };

  console.log('adding in submission_results redis stream');

  await client.XADD('submission_results', '*', data);

  return (response.status = 200);
});

router.post(
  '/questions/:questionId/upvote',
  async ({ request, response, params, state }) => {
    const { questionId } = params;
    const { user } = state;

    let qId = await questionService.addUpvote(questionId, user);

    if (qId.length === 0) return;
    const data = {
      user,
      questionId,
      feedback: 'Question has been upvoted',
    };

    console.log('adding in submission_results redis stream');

    await client.XADD('submission_results', '*', data);

    return (response.status = 200);
  }
);

export default router;
