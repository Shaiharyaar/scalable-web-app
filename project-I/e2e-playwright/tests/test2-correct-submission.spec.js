import { test, expect } from '@playwright/test';

test('success feedback on correct submission', async ({ page }) => {
  await page.goto('http://localhost:7800/');
  const selectorEle = await page.locator('#assignment-selection');
  await selectorEle.selectOption({ label: '1. Hello' });
  await page.locator('#coding-textarea').click();
  await page.locator('#coding-textarea').fill('def hello():\n\treturn "Hello"');
  await page.getByRole('button', { name: 'Submit' }).click();
  const feedbackBox = await page.locator('#submission-feedback-container');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(feedbackBox).toContainText('Your submission is correct!');
});
