import type { Page } from "@playwright/test";
import node4544823443Mock from "~/domains/edit/tests/mocks/node-4544823443-osm-mock.json";
import placeInfoMock from "~/domains/edit/tests/mocks/place-infos-mock.json";
import way126125230Mock from "~/domains/edit/tests/mocks/way-126125230-osm-mock.json";

export const getEditButton = (page: Page, testid: string) => {
  return page.locator(`[data-testid^="${testid}"]`).first();
};

export const getMenuItem = (page: Page, testId: string) => {
  return page.getByTestId(testId);
};

export const getDialog = (page: Page) => {
  return page.locator(`[data-testid^="dialog"]`).first();
};

export const mockOSMFeature = async (page: Page) => {
  await page.route(
    "**/api/v1/amenities/node/4544823443.geojson*",
    async (route) => {
      await route.fulfill({ json: node4544823443Mock });
    },
  );
  await page.route(
    "**/api/v1/buildings/way/126125230.geojson*",
    async (route) => {
      await route.fulfill({ json: way126125230Mock });
    },
  );
  await page.route("**/place-infos.json?*", async (route) => {
    await route.fulfill({ json: placeInfoMock });
  });

  await page.goto(
    "/composite/amenities:node:4544823443,buildings:way:126125230?q=",
  );
};
