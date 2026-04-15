import { expect, type Page, test } from "@playwright/test";

// Helper to dismiss onboarding dialog
async function dismissOnboarding(page: Page) {
  await page.waitForLoadState("networkidle");
}

test.describe("any danger inside", () => {
  test.beforeEach(async ({ page: Page }) => {
    await Page.goto("/");
    await dismissOnboarding(Page);
  });

  test("should show if there is a fire brigade inside", async ({ page }) => {});

  test("should show if there is a doctor inside", async ({ page }) => {});
});
