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

test("Selected amenity marker should display on map", async ({
  page,
  mapLocator,
}) => {
  await page.goto("/amenities/node:348000444", {
    waitUntil: "domcontentloaded",
  });

  await expect(
    page.locator(".mapboxgl-canvas, .maplibregl-canvas").first(),
  ).toBeVisible({ timeout: 15000 });

  // await page
  //   .locator('[data-mapgrab-map-id="mainMap"]')
  //   .waitFor({ state: "attached", timeout: 30000 });

  const selectedAmenityMarker = mapLocator(
    'map[id=mainMap] layer[id=osm-amenities-selected-poi-point-focus] filter["all", ["has", "amenity"]]',
  );

  await expect(selectedAmenityMarker).toBeVisibleOnMap();

  // await expect(country).toBeVisibleOnMap();
});
