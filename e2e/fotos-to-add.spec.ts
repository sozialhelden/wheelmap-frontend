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

    // await expect(page.getByRole('dialog')).not.toBeVisible();

    // if (test.info().project.name.match(/mobile/i)) {
    //   // On mobiles, the search is hidden behind a button that auto-focuses the input field on opening
    //   await page.getByLabel('Search', { exact: true }).click();
    // } else {
    //   // On the desktop, the search input is always visible
    //   await page.getByPlaceholder('Search for place or address').click();
    // }
    // await page.waitForURL('**/search');
    // await page.getByPlaceholder('Search for place or address').fill('Greifswalder Str.');
    // await page.getByRole('link', { name: 'Greifswalder Straße (Restaurant)' }).click();
    // await page.getByRole('link', { name: 'Add new image' }).click();
    // await page.getByRole('button', { name: 'Continue' }).click();
    // await page.getByRole('button', { name: 'Select image' }).click();
    // await page.locator('div').filter({ hasText: 'Select an image1. Criteria2.' }).nth(1).click();
    // await page.getByRole('button', { name: 'Upload image' }).click();
    // await page.getByRole('button', { name: 'Continue' }).click();
   // await page.locator('html').click();
    //await page.goto('https://feature-a11ymap.wheelmap.tech/onboarding');
   // await expect(page.getByRole('button', { name: 'Okay, let’s go!' })).toBeVisible();
   // await page.getByRole('button', { name: 'Okay, let’s go!' }).click();
  //  await page.getByRole('button', { name: 'I’m in!' }).click();
  //  await page.goto('https://feature-a11ymap.wheelmap.tech/');
  //  await page.getByPlaceholder('Search for place or address').click();
    //await page.getByPlaceholder('Search for place or address').fill('Greifswalder Str');
   // await page.goto('https://feature-a11ymap.wheelmap.tech/search?q=Greifswalder+Str&category=&toilet=&wheelchair=');
  //  await page.getByRole('link', { name: 'Greifswalder Straße (' }).click();
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
 

test('change to fotos', async ({ page }) => {

  await page.goto(baseURL);
  await skipOnboarding(page);
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.click('text=Add new image');
  await page.click('text=Continue');
  //await page.waitForURL('**/photos');
});

test.describe("when the menu is closed", () => {
  test('has correct ARIA snapshot on desktops', async ({ page }) => {
    skipOnMobiles();

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
    await expect(page.getByRole('banner')).toMatchAriaSnapshot(`
      - banner:
        - link "Home":
          - img "Wheelmap logo"
        - navigation:
          - button "Show menu"
    `);
  });
});