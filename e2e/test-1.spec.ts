import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://feature-a11ymap.wheelmap.tech/onboarding');
  await page.getByRole('button', { name: 'Okay, let’s go!' }).click();
  await page.getByRole('button', { name: 'I’m in!' }).click();
  await page.goto('https://feature-a11ymap.wheelmap.tech/');
  await page.getByLabel('Map', { exact: true }).click({
    position: {
      x: 598,
      y: 348
    }
  });
  await page.getByPlaceholder('Search for place or address').click();
  await page.getByPlaceholder('Search for place or address').click();
  await page.getByPlaceholder('Search for place or address').fill('g');
  await page.goto('https://feature-a11ymap.wheelmap.tech/search?q=g&category=&toilet=&wheelchair=');
  await page.getByPlaceholder('Search for place or address').fill('gre');
  await page.goto('https://feature-a11ymap.wheelmap.tech/search?q=gre&category=&toilet=&wheelchair=');
  await page.getByPlaceholder('Search for place or address').fill('grei');
  await page.goto('https://feature-a11ymap.wheelmap.tech/search?q=grei&category=&toilet=&wheelchair=');
  await page.getByPlaceholder('Search for place or address').fill('greif');
  await page.goto('https://feature-a11ymap.wheelmap.tech/search?q=greif&category=&toilet=&wheelchair=');
  await page.getByPlaceholder('Search for place or address').fill('greifs');
  await page.goto('https://feature-a11ymap.wheelmap.tech/search?q=greifs&category=&toilet=&wheelchair=');
  await page.getByRole('link', { name: 'Greifswalder Straße 10405' }).click();
  await page.locator('section').getByRole('button').click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Okay, let’s go!' }).click();
  await page.getByRole('button', { name: 'Skip' }).click();
  await page.getByRole('button', { name: 'Let’s go!' }).click();
  await page.getByLabel('Map', { exact: true }).click({
    position: {
      x: 409,
      y: 360
    }
  });
 
});