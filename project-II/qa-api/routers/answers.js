import { Router } from '../deps.js';
import * as answerService from '../services/answers.js';

const router = new Router();

router.get(
  `/questions/:questionId/answers`,
  async ({ request, response, params, state }) => {
    const { user } = state;
    const { questionId } = params;
    const answers = await answerService.getAllSorted(user, questionId);
    response.body = answers;
  }
);

export default router;
