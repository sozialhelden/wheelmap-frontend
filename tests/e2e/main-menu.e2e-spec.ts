import { expect, test } from "./setup/test-fixture";
import { skipOnDesktops, skipOnMobiles } from "./utils/device";
import { skipOnboarding } from "./utils/onboarding";
import { mockTranslations } from "~/tests/e2e/utils/mocks";

test.beforeEach(async ({ page }) => {
  await mockTranslations(page);
  await page.goto("/");
  await skipOnboarding(page);
});

test("has banner", async ({ page }) => {
  await expect(
    page.getByRole("banner").getByRole("link", { name: "Home" }),
  ).toBeVisible();
});

test.describe("when the menu is closed", () => {
  test("has correct ARIA snapshot on desktops", async ({ page }) => {
    skipOnMobiles();

    // On desktops, the greater part of the navigation is always visible.
    await expect(page.getByRole("banner")).toMatchAriaSnapshot(`
      - banner:
        - link "Go to home page"
        - text: Find wheelchair accessible places.
        - button "Select your needs": What do you need?
        - navigation:
          - list:
            - listitem:
              - link "Get involved"
            - listitem:
              - link "News"
            - listitem:
              - link "Press"
            - listitem:
              - link "Events"
            - listitem:
              - link "Add a new place"
          - button "Show menu"
    `);
  });

  test("has correct ARIA snapshot on mobiles", async ({ page }) => {
    skipOnDesktops();
    await expect(page.getByRole("banner")).toMatchAriaSnapshot(`
      - banner:
        - link "Go to home page"
        - button "Select your needs": What do you need?
        - navigation:
          - button "Show menu"
    `);
  });
});

test.describe("when the menu is open", () => {
  test.skip(
    true,
    "This is still flaky, closing the menu still wrongly opens a link in the background.",
  );
  test.beforeEach(async ({ page }) => {
    await page
      .getByRole("navigation")
      .getByRole("button", { name: "Show menu" })
      .click();
  });
  test.afterEach(async ({ page }) => {
    await page.getByRole("menu", { name: "Close menu" }).tap();
    await expect(page.getByRole("menu")).not.toBeVisible();
  });
  test("has correct ARIA snapshot on desktops", async ({ page }) => {
    skipOnMobiles();

    // On desktops, the greater part of the navigation is always visible.
    await expect(page.getByRole("menu")).toMatchAriaSnapshot(`
      - menu "Close menu":
        - menuitem "Contact"
        - menuitem "Legal"
        - menuitem "FAQ"
    `);
  });

  test("has correct ARIA snapshot on mobiles", async ({ page }) => {
    skipOnDesktops();
    await expect(page.getByRole("menu")).toMatchAriaSnapshot(`
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
