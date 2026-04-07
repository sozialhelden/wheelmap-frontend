import { type Page, expect, test } from "@playwright/test";

/**
 * Asserts that at least one map feature matching the given filter is rendered on the map.
 *
 * 1. Waits for the Mapbox/MapLibre canvas to be visible in the DOM.
 * 2. Waits for the map to become idle (not moving, style loaded, tiles loaded).
 * 3. Queries rendered features using the provided Mapbox expression filter.
 * 4. Expects at least one matching feature to be present.
 *
 * @param page  - Playwright page instance.
 * @param filter - A Mapbox/MapLibre expression filter (e.g. `["==", ["get", "shop"], "supermarket"]`).
 */
async function expectFeatureOnMap(page: Page, filter: unknown[]) {
  // Ensure the map canvas element is visible before interacting with the map
  await expect(
    page.locator(".mapboxgl-canvas, .maplibregl-canvas").first(),
  ).toBeVisible({ timeout: 15000 });

  // Wait until the map has finished loading tiles and is no longer animating
  await page.waitForFunction(
    () => {
      // biome-ignore lint/suspicious/noExplicitAny: accessing e2e test helper on window
      const map = (window as any).__e2eMapInstances?.mainMap;
      return (
        map && !map.isMoving() && map.isStyleLoaded() && map.areTilesLoaded()
      );
    },
    { timeout: 30000 },
  );

  // Query the map for rendered features matching the filter and return the count
  const count = await page.evaluate((f) => {
    // biome-ignore lint/suspicious/noExplicitAny: accessing e2e test helper on window
    const map = (window as any).__e2eMapInstances.mainMap;
    return map.queryRenderedFeatures(undefined, { filter: f }).length;
  }, filter);

  expect(count).toBeGreaterThan(0);
}

// Enable WebGL rendering in headless Chromium for map tests
test.use({
  launchOptions: {
    args: [
      "--enable-webgl",
      "--ignore-gpu-blocklist",
      "--use-angle=swiftshader",
    ],
  },
});

// Navigates to a known supermarket amenity page and verifies
// that a "shop=supermarket" feature is rendered on the map.
test("Supermarket should be visible on the map", async ({ page }) => {
  await page.goto("/amenities/node:348000444", {
    waitUntil: "domcontentloaded",
  });

  await expectFeatureOnMap(page, ["==", ["get", "shop"], "supermarket"]);
});
