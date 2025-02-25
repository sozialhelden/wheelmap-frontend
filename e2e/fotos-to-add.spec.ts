import { test, expect } from '@playwright/test';
import { skipOnboarding } from './skipOnboarding';
import getBaseURL from './lib/base-url';
import { awaitPlaceDetails } from '~/lib/fetchers/legacy/PlaceDetailsProps';

const baseURL = getBaseURL();

const dialogSelector = 'dialog[data-state="open"]';

async function waitForDialogToBeStable(page) {
  const dialog = await page.$(dialogSelector);
  // Needed to wait for the dialog to be fully opaque/non-transparent before running the accessibility scan
  await dialog?.waitForElementState('stable');
}

test('has base URL', async ({ page }) => {
  await page.goto(baseURL);
 
});

test('matches a snapshot', async ({ page }) => {
    await waitForDialogToBeStable(page);
    await expect(page.getByRole('dialog')).toMatchAriaSnapshot("");
  });

test('has specific area', async ({ page }) => {
  await 
});

