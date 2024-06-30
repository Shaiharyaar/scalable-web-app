import { sql } from './database/database.js';
import { createClient, commandOptions } from './deps.js';

const consumerName = crypto.randomUUID();

const client = createClient({
  url: 'redis://redis:6379',

  pingInterval: 1000,
});

self.onmessage = async () => {
  await client.connect();

  // creating consumer group
  try {
    await client.XGROUP_CREATE(
      'submission_results',
      'submission_results_group',
      '0',
      {
        MKSTREAM: true,
      }
    );
    console.log('Created consumer group.');
  } catch (e) {
    console.log('Consumer group already exists, skipped creation.');
  }

  console.log(`Starting consumer results-${consumerName}.`);

  while (true) {
    try {
      // reading data entry from redis stream
      let response = await client.XREADGROUP(
        commandOptions({
          isolated: true,
        }),
        'submission_results_group',
        consumerName,
        [
          {
            key: 'submission_results',
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

        await client.XACK('submission_results', 'submission_results_group', id);

        console.log(`Acknowledged processing of entry ${id}.`);

        const resultData = response[0].messages[0].message;
        const { submissionId, feedback } = resultData;

        const isCorrect = feedback.startsWith('.');

        try {
          const [addedSubmission] = await sql`
            UPDATE programming_assignment_submissions
            SET status='processed', grader_feedback=${feedback}, correct=${isCorrect}
            WHERE id=${submissionId} RETURNING *;
          `;
          self.postMessage(addedSubmission);
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log('No new sse worker stream entries.');
      }
    } catch (err) {
      console.error(err);
    }
  }
};
