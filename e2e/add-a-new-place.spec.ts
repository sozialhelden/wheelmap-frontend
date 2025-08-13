
import { test } from '@playwright/test';
import getBaseURL from './lib/base-url';
const baseURL = getBaseURL();


test('Add a new place', async ({ page }) => {
  await page.goto(baseURL);
  await page.getByRole('link', { name: 'Add a new place' }).click();
  await page.waitForLoadState();
  await page.waitForURL('https://wheelmap.pro/organizations/LPb4y2ri7b6fLxLFa/survey-projects/wx4mM8xFiQAsB5aLi/show?step=data.osm_place');
});


// Removed unused custom locator function
