import { Label } from '@blueprintjs/core';
import { test, expect } from './lib/axe-test';
import getBaseURL from './lib/base-url';
import { skipOnDesktops, skipOnMobiles } from './lib/device-type';
import { skipOnboarding } from './skipOnboarding';

const baseURL = getBaseURL();

test.beforeEach(async ({ page }) => {
  // Go to the starting url before each test.
  await page.goto(baseURL);
  //await skipOnboarding(page);
});

test('Goto Access Technical University', async ({ page }) => {
  await page.goto('https://feature-a11ymap.wheelmap.tech/buildings/way%3A23517902?category=&q=&wheelchair=unknown&toilet=yes&lat=52.51096600&lon=13.32576500&extent=13.3248001&extent=52.5113331&extent=13.3267297&extent=52.5105994&zoom=18.74388041');
  await page.waitForLoadState();
  await page.getByText('ER',{ exact: true}).click();
  await page.waitForLoadState();
  await page.getByText('University building').click();
  await page.waitForLoadState();
  await page.click('text="Access"');
  await page.click('text="Partially wheelchair accessible"');
  await page.waitForLoadState();
  await expect(page.getByRole('button', { name: 'Edit' })).toBeVisible();
  
  });

test('Goto Look Technical University', async ({ page }) => {
  await page.goto('https://feature-a11ymap.wheelmap.tech/buildings/way%3A23517902?category=&q=&wheelchair=unknown&toilet=yes&lat=52.51096600&lon=13.32576500&extent=13.3248001&extent=52.5113331&extent=13.3267297&extent=52.5105994&zoom=18.74388041');
  await page.waitForLoadState();
  await page.click('text="Look"');
  await page.waitForLoadState();
  await expect(page.getByText('4 levels')).toBeVisible();
  await page.waitForLoadState();
});  


test('Goto Operator Technical University', async ({ page }) => {
  await page.goto('https://feature-a11ymap.wheelmap.tech/buildings/way%3A23517902?category=&q=&wheelchair=unknown&toilet=yes&lat=52.51096600&lon=13.32576500&extent=13.3248001&extent=52.5113331&extent=13.3267297&extent=52.5105994&zoom=18.74388041');
  await page.waitForLoadState();
  await page.click('text="Operator"');
  await page.waitForLoadState();
  await page.click('text="Technische Universität Berlin"');
  await page.waitForLoadState();
  await expect(page.getByText('Technische Universität Berlin')).toBeVisible();
  await page.waitForLoadState();
});

test('Goto MySmiley Technical University', async ({ page }) => {
  await page.goto('https://feature-a11ymap.wheelmap.tech/buildings/way%3A23517902?category=&q=&wheelchair=unknown&toilet=yes&lat=52.51096600&lon=13.32576500&extent=13.3248001&extent=52.5113331&extent=13.3267297&extent=52.5105994&zoom=18.74388041');
  await page.waitForLoadState();
  await expect(page.getByRole('cell', { name: '🧑 “Es gibt auf der' })).toBeVisible();
  await page.waitForLoadState();
  await expect(page.getByRole('cell', { name: '🧑 “Es gibt auf der' }).getByRole('button')).toBeVisible();
  
});