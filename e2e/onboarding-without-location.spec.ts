import { test, expect } from './a11y/axe-test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Wheelmap/);
});

const dialogSelector = 'dialog[aria-label="Start screen"]';

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
    await expect(page.getByRole('term')).toHaveCount(4);
    await expect(page.getByRole('definition')).toHaveCount(4);
  });

  test('matches a snapshot', async ({ page }) => {
    await waitForDialogToBeStable(page);
    await expect(page.getByRole('dialog')).toMatchAriaSnapshot(`
      - dialog:
        - banner "Wheelmap":
          - img
        - paragraph:
          - paragraph: "Mark and find wheelchair accessible places — worldwide and for free. It’s easy with our traffic light system:"
        - list:
          - listitem:
            - figure "Fully wheelchair accessible marker":
              - img
              - img
            - term: Fully wheelchair accessible
            - definition: Entrance has no steps, important areas are accessible without steps.
          - listitem:
            - figure "Partially wheelchair accessible marker":
              - img
              - img
            - term: Partially wheelchair accessible
            - definition: Entrance has one step with max. 3 inches height, most areas are without steps.
          - listitem:
            - figure "Not wheelchair accessible marker":
              - img
              - img
            - term: Not wheelchair accessible
            - definition: Entrance has a high step or several steps, important areas are inaccessible.
          - listitem:
            - figure "Unknown accessibility marker":
              - img
              - img
            - term: Unknown accessibility
            - definition: Help out by marking places!
        - button "Okay, let’s go!"
    `);
  });


  // This test is skipped because the page is not fully WCAG compliant yet.
  test.skip('is WCAG-compliant', async ({ page, makeAxeBuilder }) => {
    await waitForDialogToBeStable(page);
    const accessibilityScanResults = await makeAxeBuilder()
        // Automatically uses the shared AxeBuilder configuration,
        // but supports additional test-specific configuration too
        // .include(dialogSelector)
        .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('can be closed', async ({ page }) => {
    await page.getByRole('button', { name: 'Okay, let’s go!' }).click();
    await page.getByRole('button', { name: 'Continue without location access' }).click();
    await page.getByRole('button', { name: 'Let’s go!' }).click();

    await expect(page.getByRole('dialog')).not.toBeVisible();
  });
});
