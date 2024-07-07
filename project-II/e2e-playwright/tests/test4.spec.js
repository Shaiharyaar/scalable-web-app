import { test, expect } from '@playwright/test';

test('answer is submitted and notification is shown', async ({ page }) => {
  await page.goto('http://localhost:7800/');
  const questionListEle = await page.locator('#question-list-id');
  const firstQuestion = await questionListEle.locator('.question-item').first();
  await firstQuestion.click();

  const answerFormEle = await page.locator('#answer-form-id');

  await answerFormEle.locator('#answer-text-input-id').click();
  await answerFormEle
    .locator('#answer-text-input-id')
    .fill('This is question text');

  await answerFormEle.locator('#answer-submit-button-id').click();

  const successNotificationEle = await page.locator('#success-notification-id');
  const notificationTextEle = await successNotificationEle.locator(
    '#notification-text-id'
  );
  await expect(notificationTextEle).toContainText('Answer has been submitted');
});
