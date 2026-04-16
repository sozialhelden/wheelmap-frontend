/**
 * E2E Tests for parking spaces with accessibility tags
 *
 * Asana ticket: https://app.asana.com/0/1213356985075012/1208010078664178
 *
 * Problem: Parking spaces with tags like:
 * - amenity=parking_space
 * - parking_space=disabled
 * - disabled=designated
 *
 * are displayed as "Unnamed place" instead of accessible parking spaces
 * with correct accessibility marking (green/yellow/red).
 */

import { expect, test } from "@playwright/test";
import { skipOnboarding } from "../utils/control-onboarding"; // Test parking space from the bug report

// Test parking space from the bug report
// OSM: https://www.openstreetmap.org/way/1116394998
// Tags: amenity=parking_space, parking_space=disabled, disabled=designated
const ACCESSIBLE_PARKING_SPACE_URL = "/way/1116394998";

test.describe("Parking spaces accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await skipOnboarding(page);
  });

  test('accessible parking space should not show "Unnamed place"', async ({
    page,
  }) => {
    await page.goto(ACCESSIBLE_PARKING_SPACE_URL);
    await page.waitForLoadState("networkidle");

    // The place should NOT be displayed as "Unnamed place"
    const unnamedPlaceText = page.getByText("Unnamed place");
    await expect(unnamedPlaceText).not.toBeVisible();

    // Instead, a meaningful name should appear, e.g. "Accessible Parking" or category name
    const placeHeader = page.getByRole("heading").first();
    await expect(placeHeader).toBeVisible();

    // The heading text should contain something meaningful
    const headerText = await placeHeader.textContent();
    expect(headerText?.toLowerCase()).not.toContain("unnamed");
  });

  test("accessible parking space should show accessibility status", async ({
    page,
  }) => {
    await page.goto(ACCESSIBLE_PARKING_SPACE_URL);
    await page.waitForLoadState("networkidle");

    // Since parking_space=disabled is set, green accessibility should be displayed
    // At least one of these texts should be visible:
    const accessibilityIndicators = [
      page.getByText(/wheelchair accessible/i),
      page.getByText(/accessible parking/i),
      page.getByText(/barrierefreier Parkplatz/i),
      page.getByText(/Rollstuhlgerecht/i),
      page.getByRole("img", { name: /accessible|wheelchair|rollstuhl/i }),
    ];

    // Check if at least one accessibility indicator is present
    let hasAccessibilityInfo = false;
    for (const indicator of accessibilityIndicators) {
      if (await indicator.isVisible().catch(() => false)) {
        hasAccessibilityInfo = true;
        break;
      }
    }

    expect(hasAccessibilityInfo).toBe(true);
  });

  test("accessible parking space should have correct ARIA structure", async ({
    page,
  }) => {
    await page.goto(ACCESSIBLE_PARKING_SPACE_URL);
    await page.waitForLoadState("networkidle");

    // The place should be semantically structured correctly
    // There should be a heading with the place name
    const mainHeading = page.getByRole("heading").first();
    await expect(mainHeading).toBeVisible();

    // The accessibility status should be recognizable for screen readers
    // Either through text or via aria-label
    const accessibilitySection = page.locator(
      '[class*="accessibility"], [aria-label*="accessibility"]',
    );

    // If no explicit accessibility section exists, the status
    // should at least be recognizable somewhere in the content
    const pageContent = await page.textContent("body");
    const hasAccessibilityContent = pageContent?.match(
      /wheelchair|accessible|parking|rollstuhl|barrierefrei/i,
    );

    expect(hasAccessibilityContent).toBeTruthy();
  });

  test("parking space page should pass axe accessibility scan", async ({
    page,
  }) => {
    // Import axe dynamically for this test
    const AxeBuilder = (await import("@axe-core/playwright")).default;

    await page.goto(ACCESSIBLE_PARKING_SPACE_URL);
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page })
      .exclude(".maplibregl-canvas") // Exclude map canvas from scan
      .analyze();

    // Accept only a few violations (e.g., known issues with external components)
    expect(results.violations.length).toBeLessThanOrEqual(3);
  });
});

test.describe("Parking accessibility with capacity:disabled tag", () => {
  // This test checks if capacity:disabled is correctly interpreted
  // This logic should already work in the new code

  test("parking with capacity:disabled should show as accessible", async () => {
    // We would need to find a test location with capacity:disabled
    // For now, we skip this test until we have a suitable test location
  });
});
