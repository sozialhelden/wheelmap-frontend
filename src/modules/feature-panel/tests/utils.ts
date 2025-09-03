import type { Page, Route } from "@playwright/test";
import { mockTranslations } from "~/tests/e2e/utils/mocks";

export async function setupFeatureDetailsPage(
  page: Page,
  mockData: object,
  isLoading = false,
) {
  await mockTranslations(page);
  await page.route(
    "**/api/v1/amenities/node/1234567890.geojson*",
    async (route: Route) => {
      if (isLoading) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
      await route.fulfill({ json: mockData });
    },
  );

  await page.goto("/composite/amenities:node:1234567890");

  if (isLoading) {
    return;
  }

  await page.waitForSelector('[data-testid="feature-header"]', {
    state: "visible",
    timeout: 5000,
  });
}

export const getElement = (page: Page, testid: string) => {
  return page.locator(`[data-testid="${testid}"]`);
};
