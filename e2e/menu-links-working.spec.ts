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
    await page.waitForURL('https://feature-a11ymap.wheelmap.tech/');
    await page.getByRole('banner').getByRole('link', { name: 'Get involved' }).click();
   // await expect(page).toHaveURL('https://news.wheelmap.org/en/wheelmap-ambassador-program-2021/');
   const locator = page.locator('text=Wheelmap Ambassador Program 2021');

   //await expect(locator).toBeVisible();
   //await page.getByText('Wheelmap Ambassador Program 2021').click();
   //await page.waitForURL('https://news.wheelmap.org/en/wheelmap-ambassador-program-2021/');
  // await expect(page.getByText('Wheelmap Ambassador Program 2021')).toBeVisible();
   await locator.click();
  // await page.locator('html').click();

  }
  catch (error) {
    console.error('Test failed with error:', error.message);
    console.error(error.stack);
    throw error;
  }
  });