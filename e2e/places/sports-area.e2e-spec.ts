import { test, type Page } from "@playwright/test";
import { expect } from "../setup/test-fixture";
import { waitUntilMapIsLoaded } from "../utils/wait";
import { skipOnboarding } from "../utils/control-onboarding";

test.beforeEach(async ({ page }) => {
  //await mockTranslations(page);
  await page.goto("/");
  await waitUntilMapIsLoaded(page);
  await skipOnboarding(page);
});

test.describe("Sport area", async () => {
  test("Swimming pool in the wedding between Ungarn street and Mark street and See street", async ({
    page,
  }) => {
    await page.goto(
      "https://beta.wheelmap.org/composite/amenities:way:8028463,amenities:node:12107949789?position%5Blatitude%5D=52.5119062&position%5Blongitude%5D=13.4949982&position%5Bzoom%5D=16.7625268",
    );
    await expect(
      page.getByRole("heading", { name: "Swimming Pool" }),
    ).toBeVisible();

    await expect(
      page.locator("span").filter({ hasText: "Location" }),
    ).toBeVisible();
    await expect(
      page.locator("header").filter({ hasText: "Location" }),
    ).toBeVisible();
    await expect(page.getByText("Outdoors")).toBeVisible();

    await expect(
      page.locator("span").filter({ hasText: "Sports" }),
    ).toBeVisible();
    await expect(
      page.locator("header").filter({ hasText: "Sports" }),
    ).toBeVisible();
    await expect(page.getByText("🏊🏻 Swimming")).toBeVisible();
  });

  test("Playing field between Osloer Str. and Reginhardstr.", async ({
    page,
  }) => {
    await page.goto(
      "https://beta.wheelmap.org/amenities/way:8028469?position%5Blatitude%5D=52.5119062&position%5Blongitude%5D=13.4949982&position%5Bzoom%5D=16.7625268",
    );

    await expect(
      page.getByRole("heading", { name: "Playing Field" }),
    ).toBeVisible();

    await expect(page.getByTestId("wheelchair-editor__button")).toBeVisible();

    await expect(page.getByText("Amenities")).toBeVisible();
    await expect(page.getByText("Lighting available 🔆")).toBeVisible();

    await expect(
      page.locator("div").filter({ hasText: /^Sports$/ }),
    ).toBeVisible();
    await expect(
      page.getByTestId("general-osm-section").locator("header"),
    ).toBeVisible();
    await expect(page.getByText("⚽️ Soccer")).toBeVisible();

    await expect(page.getByText("Ground", { exact: true })).toBeVisible();
    await expect(page.getByText("Grass covered ground")).toBeVisible();
  });
});
