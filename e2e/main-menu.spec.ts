import { test, expect } from './lib/axe-test';
import baseURL from './lib/base-url';
import { skipOnDesktops, skipOnMobiles } from './lib/device-type';
import { skipOnboarding } from './skipOnboarding';

test.beforeEach(async ({ page }) => {
  // Go to the starting url before each test.
  await page.goto(baseURL);
  await skipOnboarding(page);
});

test('has banner', async ({ page }) => {
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Home' })).toBeVisible();
});

test.describe("when the menu is closed", () => {
  test('has correct ARIA snapshot on desktops', async ({ page }) => {
    skipOnMobiles();

    // On desktops, the greater part of the navigation is always visible.
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

test.describe("when the menu is open", () => {
  test.skip(true, 'This is still flaky, closing the menu still wrongly opens a link in the background.');
  test.beforeEach(async ({ page }) => {
    await page.getByRole('navigation').getByRole('button', { name: 'Show menu' }).click();
  });
  test.afterEach(async ({ page }) => {
    await page.getByRole('menu', { name: 'Close menu' }).click();
    await expect(page.getByRole('menu')).not.toBeVisible();
  });
  test('has correct ARIA snapshot on desktops', async ({ page }) => {
    skipOnMobiles();

    // On desktops, the greater part of the navigation is always visible.
    await expect(page.getByRole('menu')).toMatchAriaSnapshot(`
      - menu "Close menu":
        - menuitem "Contact"
        - menuitem "Legal"
        - menuitem "FAQ"
    `);
  });

  test('has correct ARIA snapshot on mobiles', async ({ page }) => {
    skipOnDesktops();
    await expect(page.getByRole('menu')).toMatchAriaSnapshot(`
      - menu "Close menu":
        - menuitem "Get involved"
        - menuitem "News"
        - menuitem "Press"
        - menuitem "Contact"
        - menuitem "Legal"
        - menuitem "FAQ"
        - menuitem "Events"
        - menuitem "Add a new place""
    `);
  });
});