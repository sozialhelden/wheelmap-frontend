import { expect, test } from "@playwright/test";
import {
  goToMockedPlaceDetailPage,
  mockPlaceDetails,
  mockTranslations,
} from "~/tests/e2e/utils/mocks";
import { waitUntilMapIsLoaded } from "~/tests/e2e/utils/wait";

test.describe("Feature Panel", () => {
  test.beforeEach(async ({ page }) => {
    await mockTranslations(page);
    await mockPlaceDetails(page);
    await goToMockedPlaceDetailPage(page);
    await waitUntilMapIsLoaded(page);
  });

  test("renders main sections when feature data is loaded", async ({
    page,
  }) => {
    const featureHeader = page.getByTestId("feature-header");
    await expect(featureHeader).toBeVisible();
    await expect(featureHeader).toContainText(
      "Sozialhelden e.V.Non-Government Organisation",
    );

    await expect(page.getByTestId("header-image-section")).toBeVisible();
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
