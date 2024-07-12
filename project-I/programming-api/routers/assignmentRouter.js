import { Router } from '../deps.js';
import * as assignmentService from '../services/assignmentService.js';
import * as assignmentSubmissionService from '../services/assignmentSubmissionService.js';
import { cacheMethodCalls } from '../utils/cacheUtil.js';
import { client } from '../app.js';

const router = new Router();

const assignmentCachedService = cacheMethodCalls(assignmentService, []);

router.get('/assignments', async ({ response, state }) => {
  const { user } = state;
  const assignments = await assignmentCachedService.getAll();
  const submissions = await assignmentSubmissionService.getSubmissionsByUser(
    user
  );
  const completeSubmissionIdsList = submissions
    .filter((sub) => sub.correct)
    .map((sub) => sub.programming_assignment_id);

  response.body = assignments.map((assignment) => ({
    ...assignment,
    completed: completeSubmissionIdsList.includes(assignment.id),
  }));
});

router.post('/submissions', async ({ request, response, state }) => {
  const body = request.body({ type: 'json' });
  const { assignmentNumber, code } = await body.value;
  const { user } = state;

  // check if user has any pending submissions
  const areSubmissionsPending =
    await assignmentSubmissionService.hasPendingSubmissions(user);

  if (areSubmissionsPending) {
    return (response.status = 400);
  }

  const assignment = await assignmentCachedService.findAssignment(
    assignmentNumber
  );

  if (!assignment) {
    response.body = { error: 'invalid assignment number' };
    return (response.status = 400);
  }

  const { id: assignmentId, test_code } = assignment;

  const newSubmission = await assignmentSubmissionService.addSubmission(
    assignmentId,
    code,
    state.user
  );

  // check if same submission has been made before
  const hasSimilarSubmission =
    await assignmentSubmissionService.findSameAssignment(assignmentId, code);

  if (hasSimilarSubmission) {
    console.log('Similar submission found');
    const resultObject = {
      code,
      feedback: hasSimilarSubmission.grader_feedback,
      submissionId: newSubmission.id.toString(),
      user: state.user,
    };

    // adding data in redis stream
    await client.XADD('submission_results', '*', resultObject);
    return (response.status = 200);
  }

  const data = {
    code,
    user: state.user,
    testCode: test_code,
    submissionId: newSubmission.id.toString(),
  };

  // adding data in redis stream
  await client.XADD('assignment_submissions', '*', data);
  return (response.status = 200);
});

export default router;
