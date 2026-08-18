import { type Page, expect, test } from "@playwright/test";
import { skipOnboarding } from "./utils/control-onboarding";
import { countFeaturesOnMap } from "./utils/countFeaturesOnMap";
import { setView, waitForMapReady, waitForSourceLoaded } from "./utils/wait";

/**
 * Checks whether a rendered feature on the map has a specific icon, shape (layer type), and color.
 * Polls until a matching feature is found (up to 30 s).
 *
 * @param icon  - The icon image name (checked via the feature's layer layout `icon-image`).
 * @param shape - The layer type: "circle", "symbol", "fill", or "line".
 * @param color - The expected color string (checked via `circle-color`, `fill-color`,
 *                `line-color`, or `icon-color` depending on shape).
 * @param filter - Optional Mapbox filter expression to narrow down features.
 */
async function hasFeatureWithStyle(
  page: Page,
  opts: {
    icon?: string;
    shape: "circle" | "symbol" | "fill" | "line";
    color?: string;
    filter?: unknown[];
  },
) {
  const handle = await page.waitForFunction(
    (o) => {
      const map = window.__e2eMapInstances?.mainMap;
      if (!map) {
        console.log("Map instance not found");
        return false;
      }
      if (map.isMoving()) {
        console.log("Map is still moving");
        return false;
      }
      if (!map.isStyleLoaded()) {
        console.log("Map style not loaded");
        return false;
      }

      const features = map.queryRenderedFeatures(
        o.filter
          ? { filter: o.filter as mapboxgl.FilterSpecification }
          : undefined,
      );

      for (const feature of features) {
        const layerId = feature.layer?.id;
        if (!layerId) continue;

        const layerType = feature.layer?.type;
        if (layerType !== o.shape) continue;

        // Check icon (layout property on symbol layers)
        if (o.icon) {
          const iconImage = map.getLayoutProperty(layerId, "icon-image");
          if (!iconImage || !String(iconImage).includes(o.icon)) continue;
        }

        // Check color (paint property depends on layer type)
        if (o.color) {
          const colorProp =
            o.shape === "circle"
              ? "circle-color"
              : o.shape === "fill"
                ? "fill-color"
                : o.shape === "line"
                  ? "line-color"
                  : "icon-color";
          const paintColor = map.getPaintProperty(layerId, colorProp);
          if (!paintColor || String(paintColor) !== o.color) continue;
        }

        return true;
      }
      return false;
    },
    opts,
    { timeout: 30000, polling: 100 },
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
  await page.goto("/", { waitUntil: "commit" });
  await waitForMapReady(page);
  await skipOnboarding(page);
  await setView(page, { zoom: 15, center: [13.49, 52.543] });
  // await setView(page, { zoom: 15, center: [13.39, 52.525] });
  await waitForSourceLoaded(page, "amenities");

  const count = await countFeaturesOnMap(page, ["==", ["get", "name"], "REWE"]);

  console.log(`Found ${count} supermarket features on the map.`);
  expect(count).toBeGreaterThan(0);
});

test("setView should pan the map to Berlin", async ({ page }) => {
  // test.setTimeout(120_000);
  await page.goto("/", { waitUntil: "commit" });
  await waitForMapReady(page);
  await skipOnboarding(page);

  await setView(page, { zoom: 15, center: [13.389, 52.517] });

  const center = await page.evaluate(() => {
    const map = window.__e2eMapInstances?.mainMap;
    return map?.getCenter();
  });

  expect(center?.lng).toBeCloseTo(13.389, 1);
  expect(center?.lat).toBeCloseTo(52.517, 1);
});
