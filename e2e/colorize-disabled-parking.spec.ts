import { test, expect } from './lib/axe-test';
import getBaseURL from './lib/base-url';
import { skipOnboarding } from './skipOnboarding';

const baseURL = getBaseURL();

test.describe('Colorize disabled parking site', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(baseURL);
    await skipOnboarding(page);
  });

  test('should colorize disabled parking site', async ({ page, makeAxeBuilder }) => {
    // TODO: Implement test steps for colorizing disabled parking site
    // Example: await expect(page.getByRole('region', { name: /disabled parking/i })).toBeVisible();
    // Accessibility-Check (Axe)
    const accessibilityScanResults = await makeAxeBuilder().analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
