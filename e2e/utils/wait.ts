import { expect } from "@playwright/test";
import type { Page } from "@playwright/test";

/** Wait for the map canvas to be visible and the map style to be loaded. */
export async function waitForMapReady(page: Page, mapName = "mainMap") {
  await expect(
    page.locator(".mapboxgl-canvas, .maplibregl-canvas").first(),
  ).toBeVisible({ timeout: 35000 });

  await page.waitForFunction(
    (name) => {
      // biome-ignore lint/suspicious/noExplicitAny: accessing e2e test helper on window
      const map = (window as any).__e2eMapInstances?.[name];
      // biome-ignore lint/complexity/useOptionalChain: <explanation>
      return map && map.isStyleLoaded();
    },
    mapName,
    { timeout: 90000 },
  );
}

/** Wait for a specific vector tile source to finish loading. */
export async function waitForSourceLoaded(
  page: Page,
  sourceId: string,
  mapName = "mainMap",
) {
  await page.waitForFunction(
    ({ src, name }) => {
      // biome-ignore lint/suspicious/noExplicitAny: accessing e2e test helper on window
      const map = (window as any).__e2eMapInstances?.[name];
      if (!map) return false;
      return (
        map.getSource(src) && map.isSourceLoaded(src) && map.areTilesLoaded()
      );
    },
    { src: sourceId, name: mapName },
    { timeout: 30000 },
  );
}

export async function waitUntilMapIsLoaded(page: Page) {
  await page
    .getByTestId("map-ready")
    .waitFor({ state: "attached", timeout: 20000 });
}

/**
 * Wait until the map is idle (not moving, style loaded, tiles loaded).
 */
export async function waitUntilMapIsIdle(
  page: Page,
  mapName = "mainMap",
  timeout = 30000,
) {
  await page.waitForFunction(
    (name) => {
      // biome-ignore lint/suspicious/noExplicitAny: accessing e2e test helper on window
      const map = (window as any).__e2eMapInstances?.[name];
      return (
        map && !map.isMoving() && map.isStyleLoaded() && map.areTilesLoaded()
      );
    },
    mapName,
    { timeout },
  );
}

/**
 * Set the map viewport (zoom and/or center) and wait for the map to settle.
 *
 * Usage:
 * ```ts
 * await setView(page, { zoom: 2, center: [22, 42] });
 * await setView(page, { zoom: 15 });
 * await setView(page, { center: [13.4, 52.5] }, 'mainMap');
 * ```
 *
 * @param page    - Playwright page instance.
 * @param options - `zoom` (number) and/or `center` ([lng, lat]).
 * @param mapName - Key in `window.__e2eMapInstances` (default `"mainMap"`).
 */
export async function setView(
  page: Page,
  options: { zoom?: number; center?: [number, number] },
  mapName = "mainMap",
) {
  await page.evaluate(
    ({ opts, name }) => {
      // biome-ignore lint/suspicious/noExplicitAny: accessing e2e test helper on window
      const map = (window as any).__e2eMapInstances?.[name];
      if (!map)
        throw new Error(`Map "${name}" not found on window.__e2eMapInstances`);
      map.jumpTo(opts);
    },
    { opts: options, name: mapName },
  );

  await waitUntilMapIsIdle(page, mapName);
}
