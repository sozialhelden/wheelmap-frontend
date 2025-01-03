import { test, expect } from './lib/axe-test';
import { skipOnDesktops, skipOnMobiles } from './lib/device-type';
import { skipOnboarding } from './skipOnboarding';

test.describe('main menu', () => {


  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    await page.goto('/');
    await skipOnboarding(page);
  });

  test('has banner', async ({ page }) => {
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Home' })).toBeVisible();
  });

  test('has correct ARIA snapshot on desktops', async ({ page }) => {
    skipOnMobiles();
    await expect(page.getByRole('navigation')).toMatchAriaSnapshot(`
      - navigation:
        - link "Home":
          - banner "Wheelmap logo"
        - text: Find wheelchair accessible places.
        - link "Get involved"
        - link "News"
        - link "Press"
        - link "Events"
        - link "Add a new place"
        - button "Show menu"
    `);
  });

  test('has correct ARIA snapshot on mobiles', async ({ page }) => {
    skipOnDesktops();
    await expect(page.getByRole('navigation')).toMatchAriaSnapshot(`
      - navigation:
        - link "Home":
          - banner "Wheelmap logo"
        - button "Show menu"
    `);
  });
});
