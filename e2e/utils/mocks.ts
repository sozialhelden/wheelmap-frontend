import type { Page } from "@playwright/test";
import node4544823443Mock from "../edit/mocks/node-4544823443-osm-mock.json";
import placeInfoMock from "../edit/mocks/place-infos-mock.json";
import toilet_untagged_node4544823443Mock from "../edit/mocks/toilet-untagged-node-4544823443-osm-mock.json";
import way126125230Mock from "../edit/mocks/way-126125230-osm-mock.json";
import wheelchair_untagged_node4544823443Mock from "../edit/mocks/wheelchair-untagged-node-4544823443-osm-mock.json";

import transifexMockEn from "../mocks/transifex-mock-en.json";

export async function mockTranslations(page: Page) {
  await page.route("https://cds.static.transifex.net/*", async (route) => {
    await route.fulfill({ json: transifexMockEn });
  });
}

export async function mockPlaceDetails(
  page: Page,
  type: "default" | "wheelchair-untagged" | "toilet-untagged" = "default",
) {
  await page.route(
    "**/api/v1/amenities/node/4544823443.geojson*",
    async (route) => {
      const json = {
        default: node4544823443Mock,
        "wheelchair-untagged": wheelchair_untagged_node4544823443Mock,
        "toilet-untagged": toilet_untagged_node4544823443Mock,
      }[type];

      await route.fulfill({ json });
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
}

export async function goToMockedPlaceDetailPage(page: Page) {
  await page.goto(
    "/composite/amenities:node:4544823443,buildings:way:126125230?q=",
  );
}
