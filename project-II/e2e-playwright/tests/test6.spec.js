import { test, expect } from '@playwright/test';

test('answer is submitted and is shown at the top of the answer list', async ({
  page,
}) => {
  await page.goto('http://localhost:7800/');
  const questionListEle = await page.locator('#question-list-id');
  const firstQuestion = await questionListEle.locator('.question-item').first();
  await firstQuestion.click();

  const answerFormEle = await page.locator('#answer-form-id');

  await answerFormEle.locator('#answer-text-input-id').click();
  await answerFormEle
    .locator('#answer-text-input-id')
    .fill('This is answer text');

  await answerFormEle.locator('#answer-submit-button-id').click();

  await page.locator('#success-notification-id');

  const answerListEle = await page.locator('#answer-list-id');
  const firstAnswer = await answerListEle.locator('.answer-item').first();
  const answerTextEle = await firstAnswer.locator('#answer-text-id');
  await expect(answerTextEle).toContainText('This is answer text');
});
