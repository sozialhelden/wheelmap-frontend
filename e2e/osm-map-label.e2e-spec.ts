import { type Page, expect, test } from "@playwright/test";
import { skipOnboarding } from "./utils/control-onboarding";
import { countFeaturesOnMap } from "./utils/countFeaturesOnMap";
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

  const count2 = await countFeaturesOnMap(page, [
    "==",
    ["get", "shop"],
    "supermarket",
  ]);

  console.log(`Found ${count} supermarket features on the map.`);
  expect(count).toBeGreaterThan(0);
});

test("setView should pan the map to Berlin", async ({ page }) => {
  test.setTimeout(120_000);
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

// test("should find a circle feature with a specific color on the map", async ({
//   page,
// }) => {
//   test.setTimeout(120_000);
//   await page.goto("/", { waitUntil: "commit" });
//   await waitForMapReady(page);
//   await skipOnboarding(page);
//   await setView(page, { zoom: 15, center: [13.39, 52.525] });
//   await waitForSourceLoaded(page, "amenities");

//   // Diagnostic: dump all rendered layer types and ids
//   const info = await page.evaluate(() => {
//     const map = window.__e2eMapInstances?.mainMap;
//     if (!map) return { error: "no map" };
//     const style = map.getStyle();
//     const layerCount = style?.layers?.length ?? 0;
//     const sourceIds = Object.keys(style?.sources ?? {});
//     const zoom = map.getZoom();
//     const center = map.getCenter();
//     const isMoving = map.isMoving();
//     const isStyleLoaded = map.isStyleLoaded();
//     const areTilesLoaded = map.areTilesLoaded();
//     const features = map.queryRenderedFeatures();
//     const layerTypes = new Map<string, { type: string; count: number }>();
//     for (const f of features) {
//       const id = f.layer?.id;
//       const type = f.layer?.type;
//       if (id && type) {
//         const existing = layerTypes.get(id);
//         if (existing) existing.count++;
//         else layerTypes.set(id, { type, count: 1 });
//       }
//     }
//     return {
//       zoom,
//       center,
//       isMoving,
//       isStyleLoaded,
//       areTilesLoaded,
//       layerCount,
//       sourceIds,
//       featureCount: features.length,
//       sampleFeatures: features.slice(0, 5).map((f) => ({
//         target: f.target,
//         namespace: f.namespace,
//         source: f.source,
//         sourceLayer: f.sourceLayer,
//         properties: f.properties,
//         id: f.id,
//       })),
//       styleLayers: style?.layers?.map((l: any) => ({
//         id: l.id,
//         type: l.type,
//         source: l.source,
//       })),
//       // Try querying with specific layers
//       amenityFeatures: (() => {
//         const layerIds = (style?.layers ?? []).map((l: any) => l.id);
//         try {
//           const f = map.queryRenderedFeatures(undefined, { layers: layerIds });
//           return f.slice(0, 3).map((feat: any) => ({
//             layer: feat.layer,
//             source: feat.source,
//             sourceLayer: feat.sourceLayer,
//             target: feat.target,
//             namespace: feat.namespace,
//             props: feat.properties,
//             keys: Object.keys(feat),
//           }));
//         } catch (e) {
//           return String(e);
//         }
//       })(),
//       layers: Object.fromEntries(layerTypes),
//     };
//   });
//   console.log("Map state:", JSON.stringify(info, null, 2));

//   const found = await hasFeatureWithStyle(page, {
//     shape: "circle",
//   });

//   expect(found).toBe(true);
// });

// test("should find a symbol feature with an icon on the map", async ({
//   page,
// }) => {
//   test.setTimeout(120_000);
//   await page.goto("/", { waitUntil: "commit" });
//   await waitForMapReady(page);
//   await skipOnboarding(page);
//   await setView(page, { zoom: 15, center: [13.39, 52.525] });
//   await waitForSourceLoaded(page, "amenities");

//   const found = await hasFeatureWithStyle(page, {
//     shape: "symbol",
//   });

//   expect(found).toBe(true);
// });
