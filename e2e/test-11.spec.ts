import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://feature-a11ymap.wheelmap.tech/onboarding');
  await page.getByRole('button', { name: 'Okay, let’s go!' }).click();
  await page.goto('https://feature-a11ymap.wheelmap.tech/onboarding');
  await page.getByRole('button', { name: 'I’m in!' }).click();
  await page.goto('https://feature-a11ymap.wheelmap.tech/');
  await page.getByPlaceholder('Search for place or address').click();
  await page.getByPlaceholder('Search for place or address').fill('g');
  await page.goto('https://feature-a11ymap.wheelmap.tech/search?q=g&category=&toilet=&wheelchair=');
  await page.getByPlaceholder('Search for place or address').fill('gre');
  await page.goto('https://feature-a11ymap.wheelmap.tech/search?q=gre&category=&toilet=&wheelchair=');
  await page.getByPlaceholder('Search for place or address').fill('grei');
  await page.goto('https://feature-a11ymap.wheelmap.tech/search?q=grei&category=&toilet=&wheelchair=');
  await page.getByPlaceholder('Search for place or address').fill('greis');
  await page.goto('https://feature-a11ymap.wheelmap.tech/search?q=greis&category=&toilet=&wheelchair=');
  await page.getByPlaceholder('Search for place or address').fill('grei');
  await page.goto('https://feature-a11ymap.wheelmap.tech/search?q=grei&category=&toilet=&wheelchair=');
  await page.getByPlaceholder('Search for place or address').fill('greif');
  await page.goto('https://feature-a11ymap.wheelmap.tech/search?q=greif&category=&toilet=&wheelchair=');
  await page.getByRole('link', { name: 'Greifswalder Straße (' }).click();
  await page.getByRole('link', { name: 'Add new image' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Select image' }).click();
  await page.getByRole('button', { name: 'Select image' }).setInputFiles('1000015953.jpg');
  await page.getByRole('button', { name: 'Upload image' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('Map', { exact: true }).click({
    position: {
      x: 642,
      y: 635
    }
  });
  await page.getByRole('button', { name: 'Okay, let’s go!' }).click();
  await page.goto('https://feature-a11ymap.wheelmap.tech/onboarding');
  await page.getByRole('button', { name: 'I’m in!' }).click();
  await page.goto('https://feature-a11ymap.wheelmap.tech/');
  await page.getByPlaceholder('Search for place or address').click();
  await page.getByPlaceholder('Search for place or address').fill('G');
  await page.goto('https://feature-a11ymap.wheelmap.tech/search?q=G&category=&toilet=&wheelchair=');
  await page.getByPlaceholder('Search for place or address').fill('Gr');
  await page.goto('https://feature-a11ymap.wheelmap.tech/search?q=Gr&category=&toilet=&wheelchair=');
  await page.getByPlaceholder('Search for place or address').fill('Gre');
  await page.goto('https://feature-a11ymap.wheelmap.tech/search?q=Gre&category=&toilet=&wheelchair=');
  await page.getByPlaceholder('Search for place or address').fill('Grei');
  await page.goto('https://feature-a11ymap.wheelmap.tech/search?q=Grei&category=&toilet=&wheelchair=');
  await page.getByPlaceholder('Search for place or address').fill('Greit');
  await page.goto('https://feature-a11ymap.wheelmap.tech/search?q=Greit&category=&toilet=&wheelchair=');
  await page.getByPlaceholder('Search for place or address').fill('Grei');
  await page.goto('https://feature-a11ymap.wheelmap.tech/search?q=Grei&category=&toilet=&wheelchair=');
  await page.getByPlaceholder('Search for place or address').fill('Greif');
  await page.goto('https://feature-a11ymap.wheelmap.tech/search?q=Greif&category=&toilet=&wheelchair=');
  await page.getByRole('link', { name: 'Greifswalder Straße (' }).click();
  await page.getByRole('link', { name: 'Greifswalder Straße (' }).click();
  await page.goto('https://feature-a11ymap.wheelmap.tech/ac:PlaceInfo/hjyobQfYZ5xPrDohy?q=&category=&toilet=&wheelchair=&lat=52.5402462&lon=13.4389887&extent=');
  await page.getByRole('link', { name: 'Add new image' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Select image' }).click();
  await page.getByRole('button', { name: 'Select image' }).setInputFiles('1000015934.jpg');
  await page.getByRole('button', { name: 'Upload image' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('link', { name: 'Report' }).click();
  await page.getByRole('link', { name: 'Back' }).click();
  await page.getByLabel('Map', { exact: true }).click({
    position: {
      x: 932,
      y: 219
    }
  });
});
 