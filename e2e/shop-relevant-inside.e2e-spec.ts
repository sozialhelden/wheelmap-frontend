import { expect, type Page, test } from "@playwright/test";

// Helper to dismiss onboarding dialog
async function dismissOnboarding(page: Page) {
  await page.waitForLoadState("networkidle");

  // const dialog = page.getByRole("dialog");
  //
  // try {
  //   await dialog.waitFor({ state: "visible", timeout: 5000 });
  //
  //   // Click through all visible onboarding buttons
  //   const buttonPatterns = [/okay|let.*go/i, /skip/i, /let.*go/i];
  //
  //   for (const pattern of buttonPatterns) {
  //     const button = page.getByRole("button", { name: pattern });
  //     if (await button.isVisible({ timeout: 2000 }).catch(() => false)) {
  //       await button.click();
  //       await page.waitForTimeout(500);
  //     }
  //   }
  // } catch {
  //   // Dialog may not appear
  // }
}

test.describe("articles-to-be-consumed", () => {
  test.beforeEach(async ({ page: Page }) => {
    await Page.goto("/");
    await dismissOnboarding(Page);
  });

  test("should show food that can carried away", async ({ page }) => {
    //McDonald restaurants have tags like:
    await page.goto(
      "https://feature-a11ymap.wheelmap.tech/composite/amenities:node:2613801952,amenities:node:2613826861?needs%5Btoilet%5D=no-need&position%5Blatitude%5D=52.5283417&position%5Blongitude%5D=13.3602865&position%5Bzoom%5D=14.6741169",
    );
    await page.waitForLoadState("networkidle");

    // Warte auf das Laden der Ortsdetails
    await expect(page.getByRole("heading").first()).toBeVisible();

    // Warte zusätzlich etwas für die
    // await page.waitForTimeout(2000);

    // await expect(page.getByRole("heading", { name: /McDonald/i })).toBeEnabled();

    // await expect(page.getByRole("button", { name: /diet/i })).toBeEnabled();
    // Prüfe ob der Link vorhanden ist
  });
});
