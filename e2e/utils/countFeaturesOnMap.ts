import type { Page } from "@playwright/test";

/**
 * Counts rendered features matching a Mapbox filter expression.
 * Polls until at least one feature is found (up to 30 s).
 * Returns the feature count.
 */
export async function countFeaturesOnMap(page: Page, filter: unknown[]) {
  const handle = await page.waitForFunction(
    (f) => {
      const map = window.__e2eMapInstances?.mainMap;
      if (!map) {
        console.log("Map instance not found");
        return 0;
      }
      if (map.isMoving()) {
        console.log("Map is still moving");
        return 0;
      }
      if (!map.isStyleLoaded()) {
        console.log("Map style not loaded");
        return 0;
      }
      const n = map.queryRenderedFeatures({
        filter: f as mapboxgl.FilterSpecification,
      }).length;
      return n > 0 ? n : 0;
    },
    filter,
    { timeout: 30000, polling: 100 },
  );
  return handle.jsonValue();
}
