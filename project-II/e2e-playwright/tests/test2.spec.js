import { test, expect } from '@playwright/test';

test('page loads at max 20 answers of the selected question first time', async ({
  page,
}) => {
  await page.goto('http://localhost:7800/');
  const questionListEle = await page.locator('#question-list-id');
  const firstQuestion = await questionListEle.locator('.question-item').first();
  await firstQuestion.click();
  const answerListEle = await page.locator('#answer-list-id');
  const answerCount = await answerListEle.locator('.answer-item').count();
  expect(answerCount).toBeLessThanOrEqual(20);
});
