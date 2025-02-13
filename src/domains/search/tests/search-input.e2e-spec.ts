import { test } from "@playwright/test";
import { skipOnboarding } from "../../../../tests/e2e/utils/skipOnboarding";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await skipOnboarding(page);
});

test.describe("search-input", () => {});
