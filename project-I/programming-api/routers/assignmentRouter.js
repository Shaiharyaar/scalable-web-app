import { Router } from '../deps.js';
import * as assignmentService from '../services/assignmentService.js';
import { cacheMethodCalls } from '../utils/cacheUtil.js';

const router = new Router();

const assignmentCachedService = cacheMethodCalls(assignmentService, [
  'addAssignment',
  'postSubmission',
  'getSubmissionsByUser',
  'checkForPendingSubmissions',
  'findSimilar',
]);
router.get('/getAssignments', async ({ response, state }) => {
  const assignments = await assignmentCachedService.findAll();
  const submissions = await assignmentCachedService.getSubmissionsByUser(
    state.user
  );
  const completedSubmissionsIds = submissions
    .filter((s) => s.correct)
    .map((s) => s.programming_assignment_id);

  response.body = assignments.map((a) => ({
    ...a,
    completed: completedSubmissionsIds.includes(a.id),
  }));
});

router.post('/submissions', async ({ request, response, state }) => {
  const body = request.body({ type: 'json' });
  const { assignmentNumber, code } = await body.value;

  const areSubmissionsPending =
    await assignmentCachedService.checkForPendingSubmissions(state.user);
  if (areSubmissionsPending) {
    console.log('There are pending submissions');
    return (response.status = 400);
  }

  const assignment = await assignmentCachedService.findByNumber(
    assignmentNumber
  );

  if (!assignment) {
    response.body = { error: 'invalid assignment number' };
    return (response.status = 400);
  }

  const { id: assignmentId, test_code } = assignment;

  const newSubmission = await assignmentCachedService.postSubmission(
    assignmentId,
    code,
    state.user
  );

  const similarSubmission = await assignmentCachedService.findSimilar(
    assignmentId,
    code
  );

  if (similarSubmission) {
    console.log('Similar submission found');
    const resultObject = {
      code,
      feedback: similarSubmission.grader_feedback,
      submissionId: newSubmission.id.toString(),
      user: state.user,
    };

    await client.XADD('results', '*', resultObject);
    return (response.status = 200);
  }

  console.log('No similar submissions found');

  const data = {
    code,
    user: state.user,
    testCode: test_code,
    submissionId: newSubmission.id.toString(),
  };

  await client.XADD('submissions', '*', data);
  return (response.status = 200);
});

export default router;
