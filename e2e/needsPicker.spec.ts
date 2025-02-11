import { test, expect } from 'playwright-test-coverage';
import { skipOnboarding } from './utils/skipOnboarding';

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await skipOnboarding(page);
});

test.describe('needs picker', () => {
  test('it opens a dropdown', async ({page}) => {
    const button = page.getByRole("button", { name: 'What do you need?' });
    await expect(button).toBeVisible();
    await button.click();
  });
});
