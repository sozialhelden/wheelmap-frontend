import {
  expect as mapGrabExpect,
  test as mapGrabTest,
} from "@mapgrab/playwright";
import {
  mergeExpects,
  mergeTests,
  test as playwrightTest,
} from "@playwright/test";

const test = mergeTests(playwrightTest, mapGrabTest);
const expect = mergeExpects(mapGrabExpect);

test.use({
  launchOptions: {
    args: [
      "--enable-webgl",
      "--ignore-gpu-blocklist",
      "--use-angle=swiftshader",
    ],
  },
});

test("Supermarket should be visible on the map", async ({
  page,
  mapController,
}) => {
  await page.goto("/amenities/node:348000444", {
    waitUntil: "domcontentloaded",
  });

  await expect(
    page.locator(".mapboxgl-canvas, .maplibregl-canvas").first(),
  ).toBeVisible({ timeout: 15000 });

  await mapController("mainMap").waitToMapStable();

  const count = await page.evaluate(
    () =>
      window.__MAPGRAB__
        .getMapInterface("mainMap")
        .map.queryRenderedFeatures(undefined, {
          filter: ["==", ["get", "shop"], "supermarket"],
        }).length,
  );

  expect(count).toBeGreaterThan(0);
});
