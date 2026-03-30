import type { Page } from "@playwright/test";
import type { LngLat } from "mapbox-gl";
import { expect, test } from "~/tests/e2e/setup/test-fixture";
import { mockTranslations } from "~/tests/e2e/utils/mocks";
import { waitUntilMapIsLoaded } from "~/tests/e2e/utils/wait";
import munichPhotonMock from "./munich-photon-mock.json";
import {
  getMapBounds,
  getMapCenter,
  getSearchResultItem,
  searchFor,
  waitForMapBoundsChange,
  waitUntilTestMapIsExposed,
} from "./utils";

const MUNICH_COORDINATES = {
  lat: munichPhotonMock.features[0].geometry.coordinates[1],
  lon: munichPhotonMock.features[0].geometry.coordinates[0],
};

test.beforeEach(async ({ page }) => {
  await mockTranslations(page);
  await page.goto("/");

  await waitUntilMapIsLoaded(page);
  await waitUntilTestMapIsExposed(page);
});

async function searchAndClick(page: Page, searchTerm: string) {
  await searchFor(page, searchTerm, munichPhotonMock);
  await getSearchResultItem(page, searchTerm).waitFor({ state: "visible" });
  await getSearchResultItem(page, searchTerm).click();
}

test.describe("search result map panning", () => {
  test("map canvas remains visible after panning", async ({ page }) => {
    const initialBounds = await getMapBounds(page);
    if (!initialBounds) {
      throw new Error("Failed to get initial map bounds");
    }

    await searchAndClick(page, "Munich");

    await waitForMapBoundsChange(page, initialBounds);

    const canvas = page.locator(".mapboxgl-canvas");
    await expect(canvas).toBeVisible();

    const mapContainer = page.locator(".mapboxgl-map");
    await expect(mapContainer).toBeVisible();

    // Verify we can still get bounds (map is functional)
    const bounds = await getMapBounds(page);
    expect(bounds).not.toBeNull();
  });

  test("clicking a search result pans the map to the search result center point", async ({
    page,
  }) => {
    const initialBounds = await getMapBounds(page);
    const initialCenter = await getMapCenter(page);
    if (!initialBounds) {
      throw new Error("Failed to get initial map bounds");
    }
    if (!initialCenter) {
      throw new Error("Failed to get initial center");
    }
    await searchAndClick(page, "Munich");

    await waitForMapBoundsChange(page, initialBounds);

    const newBounds = await getMapBounds(page);
    expect(newBounds).not.toBeNull();
    if (!newBounds) {
      throw new Error("Failed to get map bounds");
    }

    const newCenter: LngLat | null = await getMapCenter(page);
    if (!newCenter) {
      throw new Error("Failed to get map center");
    }

    expect(newCenter.lat).not.toBeCloseTo(initialCenter.lat, 1);
    expect(newCenter.lng).not.toBeCloseTo(initialCenter.lng, 1);

    expect(newCenter.lat).toBeCloseTo(MUNICH_COORDINATES.lat, 0.1);
    expect(newCenter.lng).toBeCloseTo(MUNICH_COORDINATES.lon, 0.1);
  });
});
