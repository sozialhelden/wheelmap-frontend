import type { Page } from "@playwright/test";
import transifexMockEn from "../mocks/transifex-mock-en.json";

export async function mockTranslations(page: Page) {
  await page.route("https://cds.static.transifex.net/*", async (route) => {
    await route.fulfill({ json: transifexMockEn });
  });
}
