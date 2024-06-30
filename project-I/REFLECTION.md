The application is compose of nine different services, each working for their own unique purpose.

1. **nginx**

   - to enhance application performance and reliability by distributing load among servers (as a load balancer) and used as a reverse proxy for secure connection

2. **programming-api**

   - to get assignments information from database and provide them to the client side
   - to submit new assignments received from client side
   - new assignment entries during submission are added to redis stream `assignment-submission`

3. **programming-ui**

   - Provide an interactive platform to user so that use this app.
   - It establishes an SSL connection with the `sse-server` to be able to listen to redis stream and update UI accordingly
   - UI is built with Astro, Svelte and TailwindCss

4. **sse-server**

   - Consumes messages from the redis stream `submission-results` and sends updates to the client using sse.
   - Uses web worker API to handle SSE connections and listen to redis stream at the same time

5. **grader-api**

   - Receives redis stream `assignment-submissions` from `programming-api` and sends the updated data into a redis stream `submission-results` which is then received on `sse-server` which then updates the client

6. **database**

   - to store data

7. **redis**

   - to cache database queries
   - generate a non-blocking communication among services using redis stream (explained in above services)

8. **flyway**

   - has a schema to ensure that the database schema is up-to-date

9. **e2e-playwright**
   - contains tests to ensure that the application works as required
