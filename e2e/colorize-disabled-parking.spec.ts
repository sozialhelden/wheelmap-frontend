import { expect, type Page, test } from "@playwright/test";

// Helper to dismiss onboarding dialog
async function dismissOnboarding(page: Page) {
  await page.waitForLoadState("networkidle");

  const dialog = page.getByRole("dialog");

  try {
    await dialog.waitFor({ state: "visible", timeout: 5000 });

    // Click through all visible onboarding buttons
    const buttonPatterns = [/okay|let.*go/i, /skip/i, /let.*go/i];

    for (const pattern of buttonPatterns) {
      const button = page.getByRole("button", { name: pattern });
      if (await button.isVisible({ timeout: 2000 }).catch(() => false)) {
        await button.click();
        await page.waitForTimeout(500);
      }
    }
  } catch {
    // Dialog may not appear
  }
}

test.describe("Colorize disabled parking site", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await dismissOnboarding(page);
  });

  test("should colorize disabled parking site", async ({ page }) => {
    await page.goto(
      "https://feature-a11ymap.wheelmap.tech/composite/amenities:4md3dtqKhPfmdbWm9?position[latitude]=52.5255148&position[longitude]=13.3691049&position[zoom]=16.0265295",
    );
    await expect(
      page.getByRole("region", { name: /disabled parking/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("region", { name: /disabled parking/i }),
    ).toHaveCSS("background-color", "rgb(0, 255, 0)"); // Example color check
  });

  test("should colorize Behindertenparkplatz", async ({ page }) => {
    await page.goto(
      "https://feature-a11ymap.wheelmap.tech/ac:PlaceInfo/vpyiAGj3jTpmybWCG?position%5Blatitude%5D=52.5255148&position%5Blongitude%5D=13.3691049&position%5Bzoom%5D=16.0265295",
    );
    await expect(
      page.getByRole("region", { name: /Behindertenparkplatz/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("region", { name: /Behindertenparkplatz/i }),
    ).toHaveCSS("background-color", "rgb(0, 255, 0)"); // Example color check
  });

  test("should call Behindertenparkplatz (8-18 h)", async ({ page }) => {
    await page.goto(
      "https://feature-a11ymap.wheelmap.tech/ac:PlaceInfo/vpyiAGj3jTpmybWCG?position%5Blatitude%5D=52.5255148&position%5Blongitude%5D=13.3691049&position%5Bzoom%5D=16.0265295",
    );
    await expect(
      page.getByRole("region", { name: /Behindertenparkplatz/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("region", {
        name: /Behindertenparkplatz (Mo-Fr 8-19 h)/i,
      }),
    ).toBeVisible();
  });

  test("should call Surface Parking", async ({ page }) => {
    await page.goto(
      "https://feature-a11ymap.wheelmap.tech/composite/amenities:way:54167545?position%5Blatitude%5D=52.5579099&position%5Blongitude%5D=13.4107353&position%5Bzoom%5D=15.6984311",
    );
    await expect(
      page.getByRole("region", { name: /Surface Parking/i }),
    ).toBeVisible();
    await expect(page.getByRole("region", { name: /P/i })).toBeVisible();
  });

  test("should call bpark.040227", async ({ page }) => {
    await page.goto(
      "https://feature-a11ymap.wheelmap.tech/composite/amenities:yNwaRFr7NZgDWQT4Y?position%5Blatitude%5D=52.5255148&position%5Blongitude%5D=13.3691049&position%5Bzoom%5D=16.0265295",
    );
    await expect(
      page.getByRole("region", { name: /bpark.040227/i }),
    ).toBeVisible();
    await expect(page.getByRole("region", { name: /bpark.040227/i })).toHaveCSS(
      "background-color",
      "rgb(0, 255, 0)",
    ); // Example color check
  });
});
