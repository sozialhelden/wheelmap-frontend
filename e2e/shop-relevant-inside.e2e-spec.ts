import { expect, type Page, test } from "@playwright/test";

// Helper to dismiss onboarding dialog
async function dismissOnboarding(page: Page) {
  await page.waitForLoadState("networkidle");
}

test.describe("articles-to-be-consumed", () => {
  test.beforeEach(async ({ page: Page }) => {
    await Page.goto("/");
    await dismissOnboarding(Page);
  });

  test("should show food that can carried away", async ({ page }) => {
    //McDonald restaurants have tags like:
    // "amenity": "fast_food"
    await page.goto(
      "http://localhost:3000/amenities/node:318149465?position%5Blatitude%5D=52.5218894&position%5Blongitude%5D=13.4115481&position%5Bzoom%5D=15.0000000&search=",
    );
    await page.waitForLoadState("networkidle");

    // Warte auf das Laden der Ortsdetails
    await expect(page.getByRole("heading").first()).toBeVisible();

    // Warte zusätzlich etwas für den Fall, dass es Verzögerungen gibt
    await page.waitForTimeout(2000);

    await expect(
      page.getByRole("heading", { name: /McDonald'?s/i }),
    ).toBeVisible();
    await page
      .locator('[data-testid="feature-header"] button')
      .dispatchEvent("click");
    await page.locator(".Sidebar__SidebarToggleButton-sc-68ee39ca-2").click();
    await expect(
      page.getByRole("heading", { name: /McDonald'?s/i }),
    ).toBeVisible();

    await expect(page.getByText("LocationGround floor")).toBeVisible();

    await expect(
      page.locator("div").filter({ hasText: /^Stay$/ }),
    ).toBeVisible();
    await expect(page.getByText("Offers takeaway.")).toBeVisible();

    await expect(page.getByText("Indoor seating available.")).toBeVisible();
    await expect(page.getByText("No outdoor seating.")).toBeVisible();
    await expect(page.getByText("Smoking prohibited 🚭")).toBeVisible();
  });

  test("should show a menu that is relevant for inside dining", async ({
    page,
  }) => {
    await page.goto(
      "http://localhost:3000/amenities/node:3773392706?needs%5Bmobility%5D=no-need&needs%5Btoilet%5D=fully-wheelchair-accessible&position%5Blatitude%5D=52.51857464&position%5Blongitude%5D=13.37604088&position%5Bzoom%5D=18.42413184",
    );
    await page.waitForLoadState("networkidle");

    // Warte auf das Laden der Ortsdetails
    await expect(page.getByRole("heading").first()).toBeVisible();

    // Warte zusätzlich etwas für den Fall, dass es Verzögerungen gibt
    await page.waitForTimeout(2000);

    await expect(
      page.getByRole("heading", {
        name: "Käfer Dachgarten-Restaurant im Deutschen Bundestag",
      }),
    ).toBeVisible();
    await page
      .locator('[data-testid="feature-header"] button')
      .dispatchEvent("click");
    await page.locator(".Sidebar__SidebarToggleButton-sc-68ee39ca-2").click();

    await expect(
      page.getByRole("heading", { name: "Käfer Dachgarten-Restaurant" }),
    ).toBeVisible();

    await expect(page.getByText("Diet")).toBeVisible();
    await expect(page.getByText("International Kitchen")).toBeVisible();

    await expect(page.getByText("🌱 Vegan choice")).toBeVisible();
    await expect(page.getByText("🌱 Vegetarian choice")).toBeVisible();
    await expect(page.getByText("Gluten-free options")).toBeVisible();
    await expect(page.getByText("🐓🥚🍳 Ovo-vegetarian")).toBeVisible();
    await expect(page.getByText("🐮🥛 Lacto-vegetarisch")).toBeVisible();

    await expect(page.getByText("StayReservation required ⚠️")).toBeVisible();
    await expect(page.getByText("Indoor seating available.")).toBeVisible();
    await expect(page.getByText("Outdoor seating available.")).toBeVisible();
  });
});
