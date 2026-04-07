import { type Page, expect, test } from "@playwright/test";
import { setView, waitForMapReady, waitForSourceLoaded } from "./utils/wait";

/**
 * Functions to develop:
 *  - is country visible on the map?
 *  - screenshot of map
 *  - operators: first, last...
 * - count
 */

// --- Helper functions ---

/** Shorthand for setView that reads well in tests. */
async function letSetView(
  page: Page,
  options: { zoom?: number; center?: [number, number] },
) {
  await setView(page, options);
}

/**
 * Counts rendered features matching a Mapbox filter expression.
 * Polls until at least one feature is found (up to 30 s).
 * Returns the feature count.
 */
async function countFeaturesOnMap(page: Page, filter: unknown[]) {
  const handle = await page.waitForFunction(
    (f) => {
      // biome-ignore lint/suspicious/noExplicitAny: e2e test helper on window
      const map = (window as any).__e2eMapInstances?.mainMap;
      if (!map || map.isMoving() || !map.isStyleLoaded()) return 0;
      const n = map.queryRenderedFeatures(undefined, { filter: f }).length;
      return n > 0 ? n : 0;
    },
    filter,
    { timeout: 30000, polling: 1000 },
  );
  return handle.jsonValue();
}

// --- Test configuration ---

test.use({
  launchOptions: {
    args: [
      "--enable-webgl",
      "--ignore-gpu-blocklist",
      "--use-angle=swiftshader",
    ],
  },
});

// --- Tests ---

test("Supermarket should be visible on the map", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await waitForMapReady(page);

  await letSetView(page, { zoom: 15, center: [13.39, 52.525] });
  await waitForSourceLoaded(page, "amenities");

  const count = await countFeaturesOnMap(page, [
    "==",
    ["get", "shop"],
    "supermarket",
  ]);

  console.log(`Found ${count} supermarket features on the map.`);
  expect(count).toBeGreaterThan(1);
});

test("setView should pan the map to Berlin", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await waitForMapReady(page);

  await letSetView(page, { zoom: 15, center: [13.389, 52.517] });

  const center = await page.evaluate(() => {
    // biome-ignore lint/suspicious/noExplicitAny: e2e test helper on window
    const map = (window as any).__e2eMapInstances?.mainMap;
    return map.getCenter();
  });

  expect(center.lng).toBeCloseTo(13.389, 1);
  expect(center.lat).toBeCloseTo(52.517, 1);
});
