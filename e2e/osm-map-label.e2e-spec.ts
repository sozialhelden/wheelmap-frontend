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

test("Paris-Moskau label should be visible on the map", async ({
  page,
  mapLocator,
  mapController,
}) => {
  await page.goto("/amenities/node:137483925", {
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

  await expect(page.getByRole("heading").first()).toContainText(
    /Paris-Moskau/i,
  );

  await mapController("mainMap").waitToMapStable();

  const placeLabel = mapLocator(
    'map[id=mainMap] layer[id=osm-amenities-highlight-poi-point-focus] filter["all", ["==", ["get", "name"], "Paris-Moskau"]]',
  );

  await expect(placeLabel).toBeVisibleOnMap();
});
