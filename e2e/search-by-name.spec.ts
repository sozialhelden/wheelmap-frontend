import { test, expect } from '@playwright/test';

test('search by name', async ({ page, browserName }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Okay, let’s go!' }).click();
  await page.getByRole('button', { name: 'Continue without location access' }).click();
  await page.getByRole('button', { name: 'Let’s go!' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();

  if (test.info().project.name.match(/mobile/i)) {
    // On mobiles, the search is hidden behind a button that auto-focuses the input field on opening
    await page.getByLabel('Search', { exact: true }).click();
  } else {
    // Om the desktop, the search input is always visible
    await page.getByPlaceholder('Search for place or address').click();
  }

  await page.waitForURL('**/search');
  await page.getByPlaceholder('Search for place or address').fill('Alexanderplatz');
  await page.getByRole('link', { name: 'Alexanderplatz (Transit station) Dircksenstraße, 10179 Berlin, Germany' }).click();
  await page.waitForURL('**/amenities/node:3908141014**');
});
