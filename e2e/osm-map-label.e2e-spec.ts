import { expect, test } from "@playwright/test";

test.use({
  launchOptions: {
    args: [
      "--enable-webgl",
      "--ignore-gpu-blocklist",
      "--use-angle=swiftshader",
    ],
  },
});

test("Supermarket should be visible on the map", async ({ page }) => {
  await page.goto("/amenities/node:348000444", {
    waitUntil: "domcontentloaded",
  });

  await expect(
    page.locator(".mapboxgl-canvas, .maplibregl-canvas").first(),
  ).toBeVisible({ timeout: 15000 });

  // Wait for map to become idle
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

  const count = await page.evaluate(() => {
    // biome-ignore lint/suspicious/noExplicitAny: accessing e2e test helper on window
    const map = (window as any).__e2eMapInstances.mainMap;
    return map.queryRenderedFeatures(undefined, {
      filter: ["==", ["get", "shop"], "supermarket"],
    }).length;
  });

  expect(count).toBeGreaterThan(0);
});
