import { Router } from '../deps.js';
import * as answerService from '../services/answers.js';
import { client } from '../app.js';

const router = new Router();

router.get(
  `/questions/:questionId/answers/:count`,
  async ({ response, params, state }) => {
    const { user } = state;
    const { count, questionId } = params;
    const answers = await answerService.getAllSorted(user, questionId, count);
    response.body = answers;
  }
);

router.post(
  '/questions/:questionId/answers',
  async ({ request, response, params, state }) => {
    const { questionId } = params;
    const body = request.body({ type: 'json' });
    const { text } = await body.value;
    const { user } = state;

    let answerId = await answerService.addAnswer(questionId, user, text);

    if (answerId.length === 0) return;

    answerId = answerId[0].answer_id;

    const data = {
      user,
      questionId,
      answerId: `${answerId}`,
      answerAdded: 'true',
      feedback: 'Answer has been added',
    };

    console.log('adding in submission_results redis stream');

    await client.XADD('answer_submission', '*', data);

    return (response.status = 200);
  }
);

router.post(
  '/questions/:questionId/answers/:answerId/upvote',
  async ({ request, response, params, state }) => {
    const { questionId, answerId } = params;
    const { user } = state;

    let aId = await answerService.addUpvote(answerId, user);

    if (aId.length === 0) return;

    const data = {
      user,
      questionId,
      answerId,
      isUpvoted: 'true',
      feedback: 'Answer has been upvoted',
    };

    console.log('adding in submission_results redis stream');

    await client.XADD('answer_submission', '*', data);

    return (response.status = 200);
  }
);

export default router;
