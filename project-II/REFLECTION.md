The application is compose of nine different services, each working for their own unique purpose.

1. **nginx**

   - to enhance application performance and reliability by distributing load among servers (as a load balancer) and used as a reverse proxy for secure connection

2. **qa-api**

   - to get assignments information from database and provide them to the client side
   - to submit new assignments received from client side
   - new assignment entries during submission are added to redis streams `question_submission` and `answer_submission`

3. **qa-ui**

   - Provide an interactive platform to user so that use this app.
   - It establishes an SSL connection with the `sse-server` to be able to listen to redis stream and update UI accordingly
   - UI is built with Astro, Svelte and TailwindCss

4. **sse-server**

   - Consumes messages from the redis streams `question-submission` and `answer_submission` and sends updates to the client using sse (when question or answer is added or upvoted).
   - Uses web worker API to handle SSE connections and listen to redis stream at the same time

5. **llm-api**

   - A large language madel which is used for generating answer for new questions

6. **database**

   - to store data

7. **redis**

   - to cache database queries
   - generate a non-blocking communication among services using redis stream (explained in above services)

8. **flyway**

   - has a schema to ensure that the database schema is up-to-date

9. **e2e-playwright**
   - contains tests to ensure that the application works as required


## Improvements

- There are many improvements that could be made. Right now in API side, the cache system for API calls is created using local Mapping system but It could be improved by using redis. 
- In UI, right now you can only upvote but cannot remove your upvote. That could be improved as well. Also an edit and delete option could be added by the user generated question and answers. 
- Right now, question which are recently created/upvoted are moved to the top but not when someone answers the question. This improvement could be made that when someone answers a question, that question could be moved to the top
