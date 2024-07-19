import { sql } from '../database/database.js';
import { createClient, commandOptions } from '../deps.js';

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
      'question_submission',
      'question_submission_group',
      '0',
      {
        MKSTREAM: true,
      }
    );
    console.log('Created question consumer group.');
  } catch (e) {
    console.log('Question Consumer group already exists, skipped creation.');
  }

  console.log(`Starting question consumer results-${consumerName}.`);

  while (true) {
    try {
      // reading data entry from redis stream
      let response = await client.XREADGROUP(
        commandOptions({
          isolated: true,
        }),
        'question_submission_group',
        consumerName,
        [
          {
            key: 'question_submission',
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

        await client.XACK(
          'question_submission',
          'question_submission_group',
          id
        );

        const resultData = response[0].messages[0].message;

        try {
          self.postMessage(resultData);
          const { user, questionId, questionAdded } = resultData ?? {};
          let autoGenAnsAdded = 'false';
          if (questionAdded) {
            for (let index = 0; index < 3; index++) {
              const res = await fetch('http://llm-api:7000/', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: resultData.text }),
              });
              let genAnsArr = await res.json();
              if (genAnsArr && genAnsArr[0]?.generated_text) {
                await sql`INSERT INTO answers (question_id, user_uuid, text, created_at)
                    VALUES (${questionId}, ${user}, ${genAnsArr[0]?.generated_text}, CURRENT_TIMESTAMP)
                    RETURNING answer_id;`;
                autoGenAnsAdded = 'true';
              }
            }
          }
          await client.XADD('answer_submission', '*', {
            answersAdded: 'true',
            autoGenAnsAdded,
            questionId,
          });
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log('No new question sse worker stream entries.');
      }
    } catch (err) {
      while (count < 10) {
        count++;
        console.error({ err });
      }
    }
  }
};
