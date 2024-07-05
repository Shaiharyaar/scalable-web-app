import { createClient, commandOptions } from './deps.js';

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

      console.log({ response });
      count = 0;
      if (response) {
        const id = response[0].messages[0].id;

        await client.XACK('submission_results', 'submission_results_group', id);

        const resultData = response[0].messages[0].message;
        try {
          self.postMessage(resultData);
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log('No new sse worker stream entries.');
      }
    } catch (err) {
      while (count < 10) {
        count++;
        console.error({ err });
      }
    }
  }
};
