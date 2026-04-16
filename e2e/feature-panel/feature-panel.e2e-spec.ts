import { expect, test } from "@playwright/test";
import {
  goToMockedPlaceDetailPage,
  mockPlaceDetails,
  mockTranslations,
} from "../utils/mocks";
import { waitUntilMapIsLoaded } from "../utils/wait";
import { skipOnboarding } from "../utils/control-onboarding";

test.describe("Feature Panel", () => {
  test.beforeEach(async ({ page }) => {
    await mockTranslations(page);
    await page.goto("/");
    await mockPlaceDetails(page);
    await skipOnboarding(page);
    await waitUntilMapIsLoaded(page);
    await goToMockedPlaceDetailPage(page);
  });

  test("renders main sections when feature data is loaded", async ({
    page,
  }) => {
    const featureHeader = page.getByTestId("feature-header");
    await expect(featureHeader).toBeVisible();
    await expect(featureHeader).toContainText(
      "Sozialhelden e.V.Non-Government Organisation",
    );

    await expect(page.getByTestId("wheelchair-section")).toBeVisible();
    await expect(page.getByTestId("toilet-section")).toBeVisible();
    await expect(page.getByTestId("general-osm-section")).toBeVisible();
    await expect(page.getByTestId("styled-icon-button-list")).toBeVisible();
  });

  // test("focuses on the heading after loading is complete", async ({ page }) => {
  //   const heading = page.locator('[data-testid="feature-header"] h1');
  //   await expect(heading).toBeFocused();
  // });
});
