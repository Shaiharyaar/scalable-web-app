import { test, expect } from '@playwright/test';

test('question is submitted and notification is shown', async ({ page }) => {
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

  const successNotificationEle = await page.locator('#success-notification-id');
  const notificationTextEle = await successNotificationEle.locator(
    '#notification-text-id'
  );
  await expect(notificationTextEle).toContainText('Question has been added');
});
