import {
  expect as mapGrabExpect,
  test as mapGrabTest,
} from "@mapgrab/playwright";
import {
  mergeExpects,
  mergeTests,
  expect as playwrightExpect,
  test as playwrightTest,
} from "@playwright/test";

const test = mergeTests(playwrightTest, mapGrabTest);
const expect = mergeExpects(playwrightExpect, mapGrabExpect);

test.use({
  launchOptions: {
    args: [
      "--enable-webgl",
      "--ignore-gpu-blocklist",
      "--use-angle=swiftshader",
    ],
  },
});

// Zoom: 17.54018500
// Center: [52.5170365,13.3888599]

test("Supermarket should be visible on the map", async ({
  page,
  mapController,
}) => {
  await page.goto("/amenities/node:348000444", {
    waitUntil: "domcontentloaded",
  });

  const isErrorPage = await page.evaluate(() => {
    return (
      location.pathname === "/_error" ||
      (document.body?.textContent || "").includes('"statusCode":500')
    );
  });

  expect(isErrorPage).toBe(false);

  await expect(
    page.locator(".mapboxgl-canvas, .maplibregl-canvas").first(),
  ).toBeVisible({ timeout: 15000 });

  await mapController("mainMap").waitToMapStable();

  const shopSupermarketCount = await page.evaluate(() => {
    const map = window.__MAPGRAB__.getMapInterface("mainMap").map;
    return map.queryRenderedFeatures(undefined, {
      filter: ["==", ["get", "shop"], "supermarket"],
    }).length;
  });

  expect(shopSupermarketCount).toBeGreaterThan(0);
});
