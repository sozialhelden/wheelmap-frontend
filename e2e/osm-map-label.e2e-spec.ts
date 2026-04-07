import { type Page, expect, test } from "@playwright/test";
import { setView } from "./utils/wait";

/**
 * Functions to develop:
 *  - is country visible on the map?
 *  - screenshot of map
 *  - operators: first, last...
 * - count
 */

/**
 * Set the map viewport (zoom and/or center) and wait for the map to settle.
 *
 * Usage:
 * ```ts
 * await letSetView(page, { zoom: 2, center: [22, 42] });
 * await letSetView(page, { zoom: 15 });
 * ```
 */
async function letSetView(
  page: Page,
  options: { zoom?: number; center?: [number, number] },
  mapName = "mainMap",
) {
  await setView(page, options, mapName);
}

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

// Sets the map view to Berlin and verifies a feature is visible after panning.
test("setView should pan the map to Berlin", async ({ page }) => {
  await page.goto("/", {
    waitUntil: "domcontentloaded",
  });

  await expect(
    page.locator(".mapboxgl-canvas, .maplibregl-canvas").first(),
  ).toBeVisible({ timeout: 15000 });

  // Wait for the map instance to be registered
  await page.waitForFunction(
    () => {
      // biome-ignore lint/suspicious/noExplicitAny: accessing e2e test helper on window
      const map = (window as any).__e2eMapInstances?.mainMap;
      // biome-ignore lint/complexity/useOptionalChain: <explanation>
      return map && map.isStyleLoaded();
    },
    { timeout: 30000 },
  );

  await letSetView(page, { zoom: 15, center: [13.389, 52.517] });

  const center = await page.evaluate(() => {
    // biome-ignore lint/suspicious/noExplicitAny: accessing e2e test helper on window
    const map = (window as any).__e2eMapInstances?.mainMap;
    return map.getCenter();
  });

  expect(center.lng).toBeCloseTo(13.389, 1);
  expect(center.lat).toBeCloseTo(52.517, 1);
});
