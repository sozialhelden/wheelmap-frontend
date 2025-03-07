import { test, expect } from '@playwright/test';
import { skipOnboarding } from './skipOnboarding';
import getBaseURL from './lib/base-url';
const baseURL = getBaseURL();
import { skipOnMobiles, skipOnDesktops } from './lib/device-type';
const dialogSelector = 'dialog[data-state="open"]';

async function waitForDialogToBeStable(page) {
  const dialog = await page.$(dialogSelector);
  // Needed to wait for the dialog to be fully opaque/non-transparent before running the accessibility scan
  await dialog?.waitForElementState('stable');
}

test('has base URL', async ({ page }) => {
  await page.goto(baseURL);
 
});

test('upload a photo', async ({ page }) => {
  try {
    await page.goto(baseURL);
    await skipOnboarding(page);
    await page.goto(baseURL + '/amenities/way:30050297');
    await page.getByRole('link', { name: 'Add new image' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Select image' }).click();
    await page.locator('input[type=file]').setInputFiles('./e2e/1000015934.jpg');
    await page.getByRole('button', { name: 'Upload image' }).click();
  }
  catch (error) {
    console.error('Test failed with error:', error.message);
    console.error(error.stack);
    throw error;
  }
});


test.describe("when the menu is closed", () => {
  test('has correct ARIA snapshot on desktops', async ({ page }) => {
    
    skipOnMobiles();
    await page.goto(baseURL);
    await skipOnboarding(page);
    // On desktops, the greater part of the navigation is always visible.
    await expect(page.getByRole('banner')).toMatchAriaSnapshot(`
      - banner:
        - link "Home":
          - img
        - text: Find wheelchair accessible places.
        - navigation:
          - list:
            - listitem:
              - link "Get involved"
            - listitem:
              - link "News"
            - listitem:
              - link "Press"
            - listitem:
              - link "Events"
            - listitem:
              - link "Add a new place"
          - button "Show menu"
    `);
  });

  
  test('has correct ARIA snapshot on mobiles', async ({ page }) => {
    skipOnDesktops();
    await page.goto(baseURL);
    await skipOnboarding(page);
    await expect(page.getByRole('banner')).toMatchAriaSnapshot(`
      - banner:
        - link "Home":
          - img "Wheelmap logo"
        - navigation:
          - button "Show menu"
    `);
  });
});