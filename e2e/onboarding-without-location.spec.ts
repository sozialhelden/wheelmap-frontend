import { test, expect } from './a11y/axe-test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Wheelmap/);
});

const dialogSelector = '[role="dialog"][aria-label="Start screen"]';

async function waitForDialogToBeStable(page) {
  const dialog = await page.$(dialogSelector);
  // Needed to wait for the dialog to be fully opaque/non-transparent before running the accessibility scan
  await dialog?.waitForElementState('stable');
}

test.describe('onboarding dialog', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    await page.goto('/');
  });

  test('has banner', async ({ page }) => {
    await expect(page.getByRole('dialog').getByLabel('Wheelmap')).toBeVisible();
  });

  test('has 4 accessibility examples', async ({ page }) => {
    await expect(page.getByRole('listitem')).toHaveCount(4);
  });

  test('matches a snapshot', async ({ page }) => {
    await waitForDialogToBeStable(page);
    await expect(page.getByRole('dialog')).toMatchAriaSnapshot(`
      - dialog "Start screen":
        - banner:
          - banner "Wheelmap":
            - img
          - paragraph:
            - paragraph: "Mark and find wheelchair accessible places — worldwide and for free. It’s easy with our traffic light system:"
        - list:
          - listitem:
            - text: Fully wheelchair accessible
          - listitem:
            - text: Partially wheelchair accessible
          - listitem:
            - text: Not wheelchair accessible
          - listitem:
            - text: Unknown accessibility
        - contentinfo:
          - button "Okay, let’s go!":
            - text: Okay, let’s go!
    `);
  });


  // TODO: Re-Enable this when the new onboarding dialog is merged into the main branch
  test.skip('is accessible', async ({ page, makeAxeBuilder }) => {
    await waitForDialogToBeStable(page);
    const accessibilityScanResults = await makeAxeBuilder()
        // Automatically uses the shared AxeBuilder configuration,
        // but supports additional test-specific configuration too
        .include(dialogSelector)
        .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('can be closed', async ({ page }) => {
    await page.getByRole('button', { name: 'Okay, let’s go!' }).click();
    await page.getByRole('button', { name: 'Continue without location' }).click();
    await page.getByRole('button', { name: 'Skip' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });
});
