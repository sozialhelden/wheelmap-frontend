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

test('News', async ({ page }) => {

  try {
    await page.waitForURL('https://feature-a11ymap.wheelmap.tech/');
    await page.getByRole('banner').getByRole('link', { name: 'News' }).click();
    await expect(page).toHaveURL('https://news.wheelmap.org/en/#news');
  }

  catch (error) {
    console.error('Test failed with error:', error.message);
    console.error(error.stack);
    throw error;
  }
});

test('Press', async ({ page }) => {

  try {
    await page.waitForURL('https://feature-a11ymap.wheelmap.tech/');
    await page.getByRole('banner').getByRole('link', { name: 'Press' }).click();
    await expect(page).toHaveURL('https://news.wheelmap.org/en/press/');
  }


  catch (error) {
    console.error('Test failed with error:', error.message);
    console.error(error.stack);
    throw error;
  }
});

test('Events', async ({ page }) => {

  try {
    await page.waitForURL('https://feature-a11ymap.wheelmap.tech/');
    await page.getByRole('banner').getByRole('link', { name: 'Events' }).click();
    await expect(page).toHaveURL('https://feature-a11ymap.wheelmap.tech/events?q=');
  }
  
  catch (error) {
    console.error('Test failed with error:', error.message);
    console.error(error.stack);
    throw error;
  }
});

test('Add a new place', async ({ page }) => {

  try {
    await page.waitForURL('https://feature-a11ymap.wheelmap.tech/');
    await page.getByRole('banner').getByRole('link', { name: 'Add a new place' }).click();
    await expect(page).toHaveURL('https://wheelmap.pro/organizations/LPb4y2ri7b6fLxLFa/survey-projects/wx4mM8xFiQAsB5aLi/show?step=data.osm_place');
  }
  
  catch (error) {
    console.error('Test failed with error:', error.message);
    console.error(error.stack);
    throw error;
  }
});