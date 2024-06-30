import { createClient, commandOptions } from './deps.js';
import { grade } from './services/gradingService.js';

const consumerName = crypto.randomUUID();

const client = createClient({
  url: 'redis://redis:6379',
  pingInterval: 1000,
});

await client.connect();

try {
  await client.XGROUP_CREATE(
    'assignment_submissions',
    'assignment_submissions_group',
    '0',
    {
      MKSTREAM: true,
    }
  );
  console.log('Created consumer group.');
} catch (_e) {
  console.log('Consumer group already exists, skipped creation.');
}

while (true) {
  try {
    const response = await client.XREADGROUP(
      commandOptions({
        isolated: true,
      }),
      'assignment_submissions_group',
      consumerName,
      [
        {
          key: 'assignment_submissions',
          id: '>',
        },
      ],
      {
        COUNT: 1,
        BLOCK: 5000,
      }
    );

    if (response) {
      const id = response[0].messages[0].id;
      await client.XACK(
        'assignment_submissions',
        'assignment_submissions_group',
        id
      );
      const submissionData = response[0].messages[0].message;
      const { code, testCode, submissionId, user } = submissionData;

      const feedback = await grade(code, testCode);

      const resultObject = {
        code,
        feedback,
        submissionId,
        user,
      };

      console.log(resultObject);

      await client.XADD('submission_results', '*', resultObject);
    } else {
      console.log('No new grader api stream entries.');
    }
  } catch (err) {
    console.error(err);
  }
}
