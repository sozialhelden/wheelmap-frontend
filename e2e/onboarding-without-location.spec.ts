import { test, expect } from './lib/axe-test';
import getBaseURL from './lib/base-url';

const baseURL = getBaseURL();

test('has title', async ({ page }) => {
  await page.goto(baseURL);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Wheelmap/);
});

const dialogSelector = 'dialog[data-state="open"]';

async function waitForDialogToBeStable(page) {
  const dialog = await page.$(dialogSelector);
  // Needed to wait for the dialog to be fully opaque/non-transparent before running the accessibility scan
  await dialog?.waitForElementState('stable');
}

test.describe('onboarding dialog', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    await page.goto(baseURL);
  });

  test('has a logo', async ({ page }) => {
    await expect(page.getByRole('dialog').getByLabel('Wheelmap logo')).toBeVisible();
  });

  test('has 4 accessibility examples', async ({ page }) => {
    await expect(page.getByRole('term')).toHaveCount(4);
    await expect(page.getByRole('definition')).toHaveCount(4);
  });

  test('matches a snapshot', async ({ page }) => {
    await waitForDialogToBeStable(page);
    await expect(page.getByRole('dialog')).toMatchAriaSnapshot("");
  });


  test('is WCAG-compliant in the first step', async ({ page, makeAxeBuilder }) => {
    await waitForDialogToBeStable(page);

    const accessibilityScanResults = await makeAxeBuilder()
        .include("#onboarding-dialog-content")
        .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('can be closed', async ({ page }) => {
    await page.getByRole('button', { name: 'Okay, let’s go!' }).click();
    await page.getByRole('button', { name: 'Skip' }).click();
    await page.getByRole('button', { name: 'Let’s go!' }).click();

    await expect(page.getByRole('dialog')).not.toBeVisible();
  });
});
