## Run in Production

To run the application in production mode:

1. Execute: `docker compose -f docker-compose.prod.yml up --build`
   - This exposes the application to `localhost:7800`.
2. To shut it down, run: `docker compose down`

## Run in Development

To run the application in development mode:

1. Execute: `docker compose up --build`
   - This exposes the application to `localhost:7800`.
2. To run the tests and close, use: `docker compose run --entrypoint=npx e2e-playwright playwright test && docker compose rm -sf`
3. To shut it down, run: `docker compose down`


## About Kubernetes and Grafana

I have implemented everything except these due to limited time. I have set a basic layout for kubernetes but It will probably still have some issues and I haven't been able to deploy pods. 