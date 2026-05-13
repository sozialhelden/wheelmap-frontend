import { expect, type Page, test } from "@playwright/test";

// Helper to dismiss onboarding dialog
async function dismissOnboarding(page: Page) {
  await page.waitForLoadState("networkidle");
}

test.describe("wc-to-be-consumed", () => {
  test.beforeEach(async ({ page: Page }) => {
    await Page.goto("/");
    await dismissOnboarding(Page);
  });

  test("should be master of three toilets", async ({ page }) => {
    await page.goto(
      "http://localhost:3000/composite/amenities:way:1203010528?needs%5Bmobility%5D=no-need&needs%5Btoilet%5D=fully-wheelchair-accessible&position%5Blatitude%5D=52.51857464&position%5Blongitude%5D=13.37604088&position%5Bzoom%5D=18.42413184",
    );
    await page.waitForLoadState("networkidle");

    // Warte auf das Laden der Ortsdetails
    await expect(page.getByRole("heading").first()).toBeVisible();

    // Warte zusätzlich etwas für den Fall, dass es Verzögerungen gibt
    await page.waitForTimeout(2000);

    await expect(
      page.getByRole("heading", {
        name: "EcoToilette Invalidenpark, Mitte",
      }),
    ).toBeVisible();
    await page
      .locator('[data-testid="feature-header"] button')
      .dispatchEvent("click");
    await page.locator(".Sidebar__SidebarToggleButton-sc-68ee39ca-2").click();

    await expect(
      page.getByRole("heading", { name: "EcoToilette Invalidenpark, Mitte" }),
    ).toBeVisible();
    await expect(
      page.getByTestId("feature-header").getByText("Toilets"),
    ).toBeVisible();

    await expect(page.getByText("Es handelt sich um eine")).toBeVisible();

    await expect(page.getByText("Access", { exact: true })).toBeVisible();
    await expect(
      page.getByText("Fully wheelchair accessible 👍"),
    ).toBeVisible();

    await expect(page.getByText("WC", { exact: true })).toBeVisible();

    await expect(page.getByText("Changing table available")).toBeVisible();
    await expect(page.getByText("Dry toilet")).toBeVisible();
    await expect(page.getByText("Seated toilet")).toBeVisible();
    await expect(page.getByText("Hand washing facility")).toBeVisible();
  });

  test("should be fully accessible", async ({ page }) => {
    await page.goto(
      "http://localhost:3000/composite/amenities:way:1203010528?needs%5Bmobility%5D=no-need&needs%5Btoilet%5D=fully-wheelchair-accessible&position%5Blatitude%5D=52.51857464&position%5Blongitude%5D=13.37604088&position%5Bzoom%5D=18.42413184",
    );
    await page.waitForLoadState("networkidle");

    // Warte auf das Laden der Ortsdetails
    await expect(page.getByRole("heading").first()).toBeVisible();

    // Warte zusätzlich etwas für den Fall, dass es Verzögerungen gibt
    await page.waitForTimeout(2000);

    await expect(
      page.getByRole("heading", {
        name: "EcoToilette Invalidenpark, Mitte",
      }),
    ).toBeVisible();
    await page
      .locator('[data-testid="feature-header"] button')
      .dispatchEvent("click");
    await page.locator(".Sidebar__SidebarToggleButton-sc-68ee39ca-2").click();

    await expect(
      page.getByRole("heading", { name: "EcoToilette Invalidenpark, Mitte" }),
    ).toBeVisible();
    await expect(page.getByTestId("wheelchair-editor__button")).toBeVisible();
    await page.getByTestId("wheelchair-editor__button").click();

    await expect(
      page
        .getByTestId("wheelchair-editor__dialog")
        .getByText("EcoToilette Invalidenpark, MitteToilets"),
    ).toBeVisible();
    await expect(page.getByText("How wheelchair accessible is")).toBeVisible();
    await expect(
      page.getByTestId("wheelchair-editor__radio--yes"),
    ).toBeVisible();
    await expect(
      page.getByTestId("wheelchair-editor__radio--limited"),
    ).toBeVisible();
    await expect(
      page.getByTestId("wheelchair-editor__radio--no"),
    ).toBeVisible();

    await page.getByTestId("wheelchair-editor__radio--yes").click();
    await page.getByTestId("wheelchair-editor__radio--limited").click();
    await page.getByTestId("wheelchair-editor__radio--no").click();
    await page.getByTestId("wheelchair-editor__radio--yes").click();

    await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Confirm" })).toBeVisible();

    await page.getByRole("button", { name: "Confirm" }).click();
  });

  test("could be proved in accessibility", async ({ page }) => {
    await page.goto(
      "http://localhost:3000/composite/amenities:way:1203010528?needs%5Bmobility%5D=no-need&needs%5Btoilet%5D=fully-wheelchair-accessible&position%5Blatitude%5D=52.51857464&position%5Blongitude%5D=13.37604088&position%5Bzoom%5D=18.42413184",
    );
    await page.waitForLoadState("networkidle");

    // Warte auf das Laden der Ortsdetails
    await expect(page.getByRole("heading").first()).toBeVisible();

    // Warte zusätzlich etwas für den Fall, dass es Verzögerungen gibt
    await page.waitForTimeout(2000);

    await expect(
      page.getByRole("heading", {
        name: "EcoToilette Invalidenpark, Mitte",
      }),
    ).toBeVisible();
    await page
      .locator('[data-testid="feature-header"] button')
      .dispatchEvent("click");
    await page.locator(".Sidebar__SidebarToggleButton-sc-68ee39ca-2").click();

    await expect(
      page.getByRole("heading", { name: "EcoToilette Invalidenpark, Mitte" }),
    ).toBeVisible();

    // Warte auf das Laden der Ortsdetails
    await expect(
      page.getByTestId("toilets-wheelchair-editor__button"),
    ).toBeVisible();
    await page.getByTestId("toilets-wheelchair-editor__button").click();

    await expect(
      page.getByRole("heading", { name: "EcoToilette Invalidenpark, Mitte" }),
    ).toBeVisible();
    await expect(
      page
        .getByTestId("toilets-wheelchair-editor__dialog")
        .getByText("Toilets"),
    ).toBeVisible();
    await expect(page.getByText("Is this toilet wheelchair")).toBeVisible();

    await expect(page.getByTestId("toilet-radio-yes-item")).toBeVisible();
    await expect(page.getByTestId("toilet-radio-no-item")).toBeVisible();
    await page.getByTestId("toilet-radio-yes-item").click();
    await page.getByTestId("toilet-radio-no-item").click();
    await page.getByTestId("toilet-radio-yes-item").click();

    await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Send" })).toBeVisible();

    await page.getByRole("button", { name: "Send" }).click();
  });

  test("a simpler toilet", async ({ page }) => {
    await page.goto(
      "http://localhost:3000/composite/amenities:S8DaPXw7gQaW95HzZ,amenities:way:1075128825?needs%5Bmobility%5D=no-need&needs%5Btoilet%5D=fully-wheelchair-accessible&position%5Blatitude%5D=52.51857464&position%5Blongitude%5D=13.37604088&position%5Bzoom%5D=18.42413184",
    );

    await page.waitForLoadState("networkidle");
    await expect(
      page.getByRole("heading", {
        name: "Toilets",
      }),
    ).toBeVisible();
    await page
      .locator('[data-testid="feature-header"] button')
      .dispatchEvent("click");
    await page.locator(".Sidebar__SidebarToggleButton-sc-68ee39ca-2").click();

    await expect(page.getByRole("heading", { name: "Toilets" })).toBeVisible();
    await expect(
      page.getByTestId("feature-header").getByText("Toilets"),
    ).toBeVisible();
    await expect(page.getByText("Berliner Toilette")).toBeVisible();

    await expect(page.getByText("Access", { exact: true })).toBeVisible();
    await expect(
      page.getByText("Fully wheelchair accessible 👍"),
    ).toBeVisible();
    await expect(page.getByText("WC", { exact: true })).toBeVisible();
    await expect(page.getByText("Wheelchair accessible WC")).toBeVisible();
    await expect(page.getByText("No changing table available")).toBeVisible();
    await expect(page.getByText("Water flush")).toBeVisible();
    await expect(page.getByText("Seated toilet")).toBeVisible();
    await expect(page.getByText("Hand washing facility")).toBeVisible();
  });

  test("with four markers", async ({ page }) => {
    await page.goto(
      "http://localhost:3000/composite/amenities:S8DaPXw7gQaW95HzZ,amenities:way:1075128825?needs%5Bmobility%5D=no-need&needs%5Btoilet%5D=fully-wheelchair-accessible&position%5Blatitude%5D=52.51857464&position%5Blongitude%5D=13.37604088&position%5Bzoom%5D=18.42413184",
    );

    //there are four markers in this page, and all of them should be visible and clickable
    //all of them are related to the wheelchair accessibility of the toilet
    //but really two of them describing the language only in the following way:
    //"Currently, we support a limited number of languages.
    //More will be added soon! If your language is missing, please contact our support team.""
    //"is this toilet wheelchair accessible" does not need 4, but only 1 marker

    await page.waitForLoadState("networkidle");
    await expect(
      page.getByRole("heading", {
        name: "Toilets",
      }),
    ).toBeVisible();
    await page
      .locator('[data-testid="feature-header"] button')
      .dispatchEvent("click");
    await page.locator(".Sidebar__SidebarToggleButton-sc-68ee39ca-2").click();

    await expect(page.getByRole("heading", { name: "Toilets" })).toBeVisible();

    //1. marker
    await expect(page.getByTestId("wheelchair-editor__button")).toBeVisible();

    //2. marker
    await expect(
      page.getByRole("button", { name: "Add a description", exact: true }),
    ).toBeVisible();
    await expect(
      page.locator("div").filter({ hasText: /^Add a description$/ }),
    ).toBeVisible();

    //3. marker
    await expect(
      page.getByTestId("toilets-wheelchair-editor__button"),
    ).toBeVisible();

    //4. marker
    await expect(
      page.getByRole("button", { name: "Add a description  for this" }),
    ).toBeVisible();
    await expect(
      page
        .locator("div")
        .filter({ hasText: /^Add a description for this toilet$/ }),
    ).toBeVisible();
  });

  test("should be payed for", async ({ page }) => {
    await page.goto(
      "http://localhost:3000/composite/amenities:S8DaPXw7gQaW95HzZ,amenities:way:1075128825?needs%5Bmobility%5D=no-need&needs%5Btoilet%5D=fully-wheelchair-accessible&position%5Blatitude%5D=52.51857464&position%5Blongitude%5D=13.37604088&position%5Bzoom%5D=18.42413184",
    );

    await page.waitForLoadState("networkidle");
    await expect(
      page.getByRole("heading", {
        name: "Toilets",
      }),
    ).toBeVisible();
    await page
      .locator('[data-testid="feature-header"] button')
      .dispatchEvent("click");
    await page.locator(".Sidebar__SidebarToggleButton-sc-68ee39ca-2").click();

    await expect(page.getByRole("heading", { name: "Toilets" })).toBeVisible();

    await expect(page.getByText("Open", { exact: true })).toBeVisible();
    await expect(page.getByText("Open now")).toBeVisible();
    await expect(page.getByText("Always open")).toBeVisible();
    await expect(page.getByText("/7")).toBeVisible();

    await expect(page.getByText("Payment")).toBeVisible();
    await expect(page.getByText("Fees apply.")).toBeVisible();
    await expect(page.getByText("0.50 EUR")).toBeVisible();
    await expect(page.getByText("Using the urinal is free.")).toBeVisible();
    await expect(page.getByText("By card")).toBeVisible();
    await expect(page.getByText("With coins")).toBeVisible();

    await expect(page.getByText("For whom?")).toBeVisible();
    await expect(page.getByText("Publicly accessible")).toBeVisible();
    await expect(page.getByText("Gender neutral")).toBeVisible();
    await expect(page.getByText("EURO key")).toBeVisible();

    await expect(page.getByText("supervised")).toBeVisible();
    await expect(page.getByText("This place is not staffed.")).toBeVisible();

    await expect(page.getByText("Operator")).toBeVisible();
    await expect(page.getByText("Wall")).toBeVisible();
  });
});
