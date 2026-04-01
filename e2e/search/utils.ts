import type { Locator, Page } from "@playwright/test";
import { expect } from "../setup/test-fixture";

export const getSearchInput = (page: Page): Locator => {
  return page.getByRole("searchbox");
};

export const getSearchDropdown = (page: Page): Locator => {
  return page.getByTestId("search-result-dropdown");
};

export const getSearchResultItem = (page: Page, hasText: string): Locator => {
  return getSearchDropdown(page)
    .getByRole("listitem")
    .filter({ hasText })
    .first();
};

export const searchFor = async (
  page: Page,
  query: string,
  mockData: unknown,
): Promise<void> => {
  await page.route(`**/api?q=${query}*`, async (route) => {
    await route.fulfill({ json: mockData });
  });
  await getSearchInput(page).fill(query);
  await expect(getSearchDropdown(page).getByTestId("is-searching")).toHaveCount(
    0,
  );
};

export async function waitUntilTestMapIsExposed(page: Page, timeout = 20_000) {
  await page.waitForFunction(
    () => typeof window !== "undefined" && !!window.testMap,
    { timeout },
  );
}

export const getMapBounds = async (page: Page) => {
  return await page.evaluate(() => {
    const map = window.testMap;
    if (!map) {
      return null;
    }

    const bounds = map.getBounds();
    if (!bounds) {
      throw new Error("Failed to get map bounds");
    }

    return {
      north: bounds.getNorth(),
      south: bounds.getSouth(),
      east: bounds.getEast(),
      west: bounds.getWest(),
    };
  });
};

export const getMapCenter = async (page: Page) => {
  return await page.evaluate(() => {
    const map = window.testMap;
    if (!map) {
      return null;
    }
    return map.getCenter();
  });
};

export type MapBounds = {
  north: number;
  south: number;
  east: number;
  west: number;
};

export const waitForMapBoundsChange = async (
  page: Page,
  initialBounds: MapBounds,
  timeout = 10000,
) => {
  try {
    await page.waitForFunction(
      (expectedBounds) => {
        const map = window.testMap;
        if (!map) return false;

        const bounds = map.getBounds();
        if (!bounds) {
          throw new Error("Failed to get map bounds");
        }

        return (
          bounds.getNorth() !== expectedBounds.north ||
          bounds.getSouth() !== expectedBounds.south ||
          bounds.getEast() !== expectedBounds.east ||
          bounds.getWest() !== expectedBounds.west
        );
      },
      initialBounds,
      { timeout },
    );
  } catch {
    throw new Error(
      `Map bounds did not change within ${timeout}ms. Initial bounds: ${JSON.stringify(initialBounds)}`,
    );
  }
};
