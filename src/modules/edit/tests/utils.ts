import type { Locator, Page } from "@playwright/test";
import node4544823443Mock from "~/modules/edit/tests/mocks/node-4544823443-osm-mock.json";
import placeInfoMock from "~/modules/edit/tests/mocks/place-infos-mock.json";
import way126125230Mock from "~/modules/edit/tests/mocks/way-126125230-osm-mock.json";
import { mockTranslations } from "~/tests/e2e/utils/mocks";
import { waitUntilMapIsLoaded } from "~/tests/e2e/utils/skip";

export const setupPage = async (page: Page) => {
  await mockTranslations(page);
  await page.goto("/");
  //await skipOnboarding(page);  // onboarding screen is currently disabled because it causes problems
  await mockFeature(page);
  await waitUntilMapIsLoaded(page);
};

export const getEditButton = (page: Page, testid: string) => {
  return page.locator(`[data-testid^="${testid}"]`).first();
};

export const getMenuItem = (page: Page, testId: string) => {
  return page.getByTestId(testId);
};

export const getDialog = (page: Page) => {
  return page.locator(`[data-testid^="dialog"]`).first();
};

export const selectLanguage = async (
  page: Page,
  dialog: Locator,
  language: string,
) => {
  await dialog.getByRole("combobox").click();
  const selectContent = page.getByTestId("select-content");
  await selectContent.getByText(language).click();
};

export const getButton = (dialog: Locator, name: string) => {
  return dialog.getByRole("button", { name: name });
};

export const mockFeature = async (page: Page) => {
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
