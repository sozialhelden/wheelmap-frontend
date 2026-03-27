import { expect } from "../../../../../e2e/setup/test-fixture";
import type { Page } from "@playwright/test";

export async function resetOnboarding(page: Page) {
  await page.addInitScript(() => {
    localStorage.removeItem("a11ymap-app-state");
  });
}

export async function openOnboarding(page: Page) {
  await page.goto("/");
  const dialog = page.getByTestId("onboarding-dialog");
  await expect(dialog).toBeVisible({ timeout: 10000 });
  return dialog;
}

export async function skipFirstStep(page: Page, name: string) {
  await page.getByRole("button", { name: name }).click();
}
