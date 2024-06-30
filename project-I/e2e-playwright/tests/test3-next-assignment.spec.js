import { test, expect } from '@playwright/test';

test('correct submission unlocks the next assignment', async ({ page }) => {
  await page.goto('http://localhost:7800/');
  const selectorEle = await page.locator('#assignment-selection');
  await selectorEle.selectOption({ label: '1. Hello' });
  await page.locator('#coding-textarea').click();
  await page.locator('#coding-textarea').fill('def hello():\n\treturn "Hello"');
  await page.getByRole('button', { name: 'Submit' }).click();
  const feedbackBox = await page.locator('#submission-feedback-container');
  await page.getByRole('button', { name: 'Submit' }).click();
  expect(feedbackBox).toContainText('Your submission is correct!');
  await selectorEle.selectOption('2. Hello world');
  const assignmentTestEle = await page.locator('#assignment-test-container');
  await expect(assignmentTestEle).toContainText(
    'Write a function "hello" that returns the string "Hello world!"'
  );
});
