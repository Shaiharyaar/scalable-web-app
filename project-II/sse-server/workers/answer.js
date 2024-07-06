import { sql } from '../database/database.js';
import { createClient, commandOptions, postgres } from '../deps.js';

const consumerName = crypto.randomUUID();

const client = createClient({
  url: 'redis://redis:6379',
  pingInterval: 1000,
});

let count = 0;

self.onmessage = async () => {
  await client.connect();

  // creating consumer group
  try {
    await client.XGROUP_CREATE(
      'answer_submission',
      'answer_submission_group',
      '0',
      {
        MKSTREAM: true,
      }
    );
    console.log('Created answer consumer group.');
  } catch (e) {
    console.log('Answer Consumer group already exists, skipped creation.');
  }

  console.log(`Starting answer consumer results-${consumerName}.`);

  while (true) {
    try {
      // reading data entry from redis stream
      let response = await client.XREADGROUP(
        commandOptions({
          isolated: true,
        }),
        'answer_submission_group',
        consumerName,
        [
          {
            key: 'answer_submission',
            id: '>',
          },
        ],
        {
          COUNT: 1,
          BLOCK: 5000,
        }
      );

      count = 0;
      if (response) {
        const id = response[0].messages[0].id;

        await client.XACK('answer_submission', 'answer_submission_group', id);

        const resultData = response[0].messages[0].message;
        console.log({ resultData });
        try {
          self.postMessage(resultData);
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log('No new answer sse worker stream entries.');
      }
    } catch (err) {
      while (count < 10) {
        count++;
        console.error({ err });
      }
    }
  }
};
