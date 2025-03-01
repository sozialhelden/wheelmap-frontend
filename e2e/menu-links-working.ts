import { test, expect } from '@playwright/test';
import { skipOnboarding } from './skipOnboarding';
import getBaseURL from './lib/base-url';
const baseURL = getBaseURL();
import { skipOnMobiles, skipOnDesktops } from './lib/device-type';
const dialogSelector = 'dialog[data-state="open"]';

test.beforeEach(async ({ page }) => {
  // Go to the starting url before each test.
  await page.goto(baseURL);
  await skipOnboarding(page);
});

test('Get involved', async ({ page }) => {
  try {
    await page.getByRole('banner').getByRole('link', { name: 'Get involved' }).click();
    await page.waitForURL('**/get-involved');
    await page.locator('html').click();

  }
  catch (error) {
    console.error('Test failed with error:', error.message);
    console.error(error.stack);
    throw error;
  }
  });