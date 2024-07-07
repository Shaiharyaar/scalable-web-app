import { test, expect } from '@playwright/test';

test('page loads at max 20 questions first time', async ({ page }) => {
  await page.goto('http://localhost:7800/');
  const questionListEle = await page.locator('#question-list-id');
  const questionCount = await questionListEle.locator('.question-item').count();
  expect(questionCount).toBeLessThanOrEqual(20);
});
