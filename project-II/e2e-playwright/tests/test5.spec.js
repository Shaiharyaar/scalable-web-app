import { test, expect } from '@playwright/test';

test('question is submitted and is shown at the top of the question list', async ({
  page,
}) => {
  await page.goto('http://localhost:7800/');
  const showQuestionButtonEle = await page.locator('#show-question-form-id');
  await showQuestionButtonEle.click();
  const questionFormEle = await page.locator('#question-form-id');
  await questionFormEle.locator('#question-title-input-id').click();
  await questionFormEle
    .locator('#question-title-input-id')
    .fill('This is question title');

  await questionFormEle.locator('#question-text-input-id').click();
  await questionFormEle
    .locator('#question-text-input-id')
    .fill('This is question text');

  await questionFormEle.locator('#question-submit-button-id').click();

  await page.locator('#success-notification-id');

  const questionListEle = await page.locator('#question-list-id');
  const firstQuestion = await questionListEle.locator('.question-item').first();
  const titleEle = await firstQuestion.locator('#question-title-id');
  await expect(titleEle).toContainText('This is question title');
});
