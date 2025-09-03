import { expect, test } from "@playwright/test";
import wheelchair_untagged_node4544823443Mock from "~/modules/feature-panel/tests/mocks/wheelchair-untagged-node-4544823443-osm-mock.json";
import node4544823443Mock from "~/modules/feature-panel/tests/mocks/node-4544823443-osm-mock.json"; // Mock feature data for testing
import { getElement, setupFeatureDetailsPage } from "./utils";

const mockFeature = node4544823443Mock;
const mockFeatureWithoutWheelchairInfo = wheelchair_untagged_node4544823443Mock;

test.describe("Feature Panel Loading", () => {
  test("displays loading state when data is being fetched", async ({
    page,
  }) => {
    await setupFeatureDetailsPage(page, mockFeature, true);
    await expect(getElement(page, "loading-indicator")).toBeVisible();
    await expect(getElement(page, "feature-header")).not.toBeVisible();
  });

  test("renders main sections when feature data is loaded", async ({
    page,
  }) => {
    await setupFeatureDetailsPage(page, mockFeature);

    const featureHeader = getElement(page, "feature-header");
    await expect(featureHeader).toBeVisible();
    await expect(featureHeader).toContainText(
      "Sozialhelden e.V.Non-Government Organisation",
    );

    await expect(getElement(page, "header-image-section")).toBeVisible();
    await expect(getElement(page, "wheelchair-section")).toBeVisible();
    await expect(getElement(page, "toilet-section")).toBeVisible();
    await expect(getElement(page, "general-osm-section")).toBeVisible();
    await expect(getElement(page, "styled-icon-button-list")).toBeVisible();

    await expect(getElement(page, "ac-section")).not.toBeVisible();
  });

  test("conditionally renders toilet section based on feature data", async ({
    page,
  }) => {
    await setupFeatureDetailsPage(page, mockFeatureWithoutWheelchairInfo);
    await expect(getElement(page, "toilet-section")).not.toBeVisible();
  });

  test("focuses on the heading after loading is complete", async ({ page }) => {
    await setupFeatureDetailsPage(page, mockFeature);
    const heading = page.locator('[data-testid="feature-header"] h1');
    await expect(heading).toBeFocused();
  });
});
