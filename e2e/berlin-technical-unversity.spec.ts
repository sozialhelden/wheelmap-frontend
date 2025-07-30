import { Label } from '@blueprintjs/core';
import { test, expect } from './lib/axe-test';
import getBaseURL from './lib/base-url';
import { skipOnDesktops, skipOnMobiles } from './lib/device-type';
import { skipOnboarding } from './skipOnboarding';
import { Page, Locator } from '@playwright/test';

const baseURL = getBaseURL();

test.beforeEach(async ({ page }) => {
  // Go to the starting url before each test.
  //await page.goto(baseURL);
  //await skipOnboarding(page);
});

test('Goto Access ER University', async ({ page }) => {
  await page.goto('/buildings/way%3A23517902?category=&q=&wheelchair=unknown&toilet=yes&lat=52.51096600&lon=13.32576500&extent=13.3248001&extent=52.5113331&extent=13.3267297&extent=52.5105994&zoom=18.74388041');
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

test('Goto Look ER University', async ({ page }) => {
  await page.goto('/buildings/way%3A23517902?category=&q=&wheelchair=unknown&toilet=yes&lat=52.51096600&lon=13.32576500&extent=13.3248001&extent=52.5113331&extent=13.3267297&extent=52.5105994&zoom=18.74388041');
  await page.waitForLoadState();
  await page.click('text="Look"');
  await page.waitForLoadState();
  await expect(page.getByText('4 levels')).toBeVisible();
  await page.waitForLoadState();
});  


test('Goto Open ER University', async ({ page }) => {
  await page.goto('/buildings/way%3A23517902?category=&q=&wheelchair=unknown&toilet=yes&lat=52.51096600&lon=13.32576500&extent=13.3248001&extent=52.5113331&extent=13.3267297&extent=52.5105994&zoom=18.74388041');
  await page.waitForLoadState();
  await page.click('text="Operator"');
  await page.waitForLoadState();
  await page.click('text="Technische Universität Berlin"');
  await page.waitForLoadState();
  await expect(page.getByText('Technische Universität Berlin')).toBeVisible();
  await page.waitForLoadState();
});

test('Goto MySmiley ER University', async ({ page }) => {
  await page.goto('/buildings/way%3A23517902?category=&q=&wheelchair=unknown&toilet=yes&lat=52.51096600&lon=13.32576500&extent=13.3248001&extent=52.5113331&extent=13.3267297&extent=52.5105994&zoom=18.74388041');
  await page.waitForLoadState();
  await expect(page.getByRole('cell', { name: '🧑 “Es gibt auf der' })).toBeVisible();
  await page.waitForLoadState();
  await expect(page.getByRole('cell', { name: '🧑 “Es gibt auf der' }).getByRole('button')).toBeVisible();
  
});

test('Next WC is in 120 m', async ({ page }) => {
  await page.goto('/buildings/way%3A23517902?category=&q=&wheelchair=unknown&toilet=yes&lat=52.51096600&lon=13.32576500&extent=13.3248001&extent=52.5113331&extent=13.3267297&extent=52.5105994&zoom=18.74388041');
  await page.waitForLoadState();
  await page.getByRole('link', { name: 'Next wheelchair-accessible WC' }).click();
  await page.waitForLoadState();
  //the toilet is not wheelchair accessible
  await page.getByRole('cell', { name: 'Access', exact:true }).click();
  await page.getByText('Not wheelchair accessible').click();
  await page.getByTestId('wheelchair').click();
    //enter into access dialog
  await page.getByText ('Not at all').click();
  await page.getByRole('button',{ name: 'Confirm'}).click();
  await page.waitForLoadState();
  await page.getByRole('cell', { name: 'Payment', exact:true }).click();
  await page.getByText('No fees').click();
  await page.getByRole('cell', { name: 'For whom?', exact:true }).click();
  await page.getByText('Access for customers').click();
  await page.getByRole('cell', { name: 'Add a description', exact:true }).click();
  await page.getByTestId('wheelchair:description:en').click();
    //enter into description dialog
  await page.getByText('Please describe how').click();
  await page.getByRole('button', { name: 'Confirm' }).click();
  await page.waitForLoadState();
  await expect(page.getByText('Next wheelchair-accessible WC 0 m')).toBeVisible();
  await page.getByRole('link', { name: 'Next wheelchair-accessible WC' }).click();
  await page.waitForLoadState();

  //the next toilet is wheelchair accessible
  await page.getByLabel('Toilets').getByRole('button').click();
  await page.getByText('Toilets').click();
  await page.getByRole('cell', { name: 'Access', exact:true }).click();
  await page.getByText('Fully wheelchair accessible').click();
  await page.getByTestId('wheelchair').click();
    //enter into access dialog
  await page.getByTestId('dialog').getByText('Fully').click();
  await page.getByRole('button',{ name: 'Confirm'}).click();
  await page.waitForLoadState();
  await page.getByRole('cell', { name: 'Location', exact:true }).click();
  await page.getByText('Ground floor').click();
  await page.getByRole('cell', { name: 'Payment', exact:true }).click();
  await page.getByText('No fees').click();
  await page.getByRole('cell', { name: 'For whom?', exact:true }).click();
  await page.getByText('Access for customers').click();
  await page.getByRole('cell', { name: 'WC', exact:true }).click();
  await page.getByText('Accessible WC').click();
  await page.getByTestId('toilets:wheelchair').click();
    //enter into toilets dialog
  await page.getByText('Is this toilet wheelchair').click();
  await page.getByText('Yes').click();
  await page.getByRole('button', { name: 'Confirm' }).click();
  await page.waitForLoadState();
  await page.getByRole('cell', { name: 'Add a description', exact:true }).click();
   //enter into description dialog
  await page.getByTestId('wheelchair:description:en').click();
  await page.getByText('Please describe how').click();
  await page.getByRole('button', { name: 'Confirm' }).click();
  await page.waitForLoadState();
});

