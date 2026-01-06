import type { Page } from "@playwright/test";

export async function waitUntilMapIsLoaded(page: Page) {
  await page
    .getByTestId("map-ready")
    .waitFor({ state: "attached", timeout: 20000 });
}
