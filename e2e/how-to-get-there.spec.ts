import { Label } from '@blueprintjs/core';
import { test, expect } from './lib/axe-test';
import getBaseURL from './lib/base-url';
import { skipOnDesktops, skipOnMobiles } from './lib/device-type';
import { skipOnboarding } from './skipOnboarding';

const baseURL = getBaseURL();

test.beforeEach(async ({ page }) => {
  // Go to the starting url before each test.
  await page.goto(baseURL);
  await skipOnboarding(page);
});

test('Goto Access ER University', async ({ page }) => {
  await page.goto('https://feature-a11ymap.wheelmap.tech/buildings/way%3A23517902?category=&q=&wheelchair=unknown&toilet=yes&lat=52.51096600&lon=13.32576500&extent=13.3248001&extent=52.5113331&extent=13.3267297&extent=52.5105994&zoom=18.74388041');
  await page.waitForLoadState();
  await page.click('text="ER University building"');
  await page.waitForLoadState();
  await page.click('text="Access"');
  await page.click('text="Partially wheelchair accessible"');
  await page.waitForLoadState();
  await expect(page.getByRole('button', { name: 'Edit' })).toBeVisible();
 // await expect(page.getByRole('button').first()).toBeVisible();
    //<button data-accent-color="" aria-label="Edit" tabindex="-1" class="rt-reset rt-BaseButton rt-r-size-2 rt-variant-soft rt-IconButton"><svg width="18" height="18" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg></button>
});

test('Goto Look ER University', async ({ page }) => {
  await page.goto('https://feature-a11ymap.wheelmap.tech/buildings/way%3A23517902?category=&q=&wheelchair=unknown&toilet=yes&lat=52.51096600&lon=13.32576500&extent=13.3248001&extent=52.5113331&extent=13.3267297&extent=52.5105994&zoom=18.74388041');
  await page.waitForLoadState();
  await page.click('text="Look"');
  await page.waitForLoadState();
  await expect(page.getByText('4 levels')).toBeVisible();
  await page.waitForLoadState();
});  


test('Goto Operator ER University', async ({ page }) => {
  await page.goto('https://feature-a11ymap.wheelmap.tech/buildings/way%3A23517902?category=&q=&wheelchair=unknown&toilet=yes&lat=52.51096600&lon=13.32576500&extent=13.3248001&extent=52.5113331&extent=13.3267297&extent=52.5105994&zoom=18.74388041');
  await page.waitForLoadState();
  await page.click('text="Operator"');
  await page.waitForLoadState();
  await page.click('text="Technische Universität Berlin"');
  await page.waitForLoadState();
  await expect(page.locator('button#radix-:ra')).toBeVisible();
  //await expect(page.locator('button[data-accent-color][aria-label="Edit"]')).toBeVisible();
});

test('Goto MySmiley ER University', async ({ page }) => {
  await page.goto('https://feature-a11ymap.wheelmap.tech/buildings/way%3A23517902?category=&q=&wheelchair=unknown&toilet=yes&lat=52.51096600&lon=13.32576500&extent=13.3248001&extent=52.5113331&extent=13.3267297&extent=52.5105994&zoom=18.74388041');
  await page.waitForLoadState();
  await page.click('text="Es gibt auf Campusseite"');
  await page.waitForLoadState();
  await page.click('class="wheelchair:description"');
  await page.waitForLoadState();
  await expect(page.locator('button#radix-:r8:')).toBeVisible();
});