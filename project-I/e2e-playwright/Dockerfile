FROM mcr.microsoft.com/playwright:v1.45.0-focal

COPY . /e2e-playwright

WORKDIR /e2e-playwright

RUN npm install
RUN npx playwright install chromium

CMD [ "npx", "playwright", "test", "--reporter=list" ]