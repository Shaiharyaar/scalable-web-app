FROM denoland/deno:alpine-1.31.0

EXPOSE 5050

WORKDIR /app

COPY deps.js .

RUN deno cache deps.js

COPY . .

CMD [ "run", "--unstable", "--watch", "--allow-net", "--allow-read", "--allow-env", "app.ts" ]