import { expect } from "../setup/test-fixture";
import type { Page } from "@playwright/test";
import { onboardingCopy } from "~/modules/onboarding/onboarding-copy";

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

export async function skipFirstOnboardingStep(page: Page, name: string) {
  await page.getByRole("button", { name: name }).click();
}

export async function skipOnboarding(page: Page) {
  const dialog = page.getByTestId("onboarding-dialog");
  await expect(dialog).toBeVisible({ timeout: 10000 });
  await page
    .getByRole("button", { name: onboardingCopy.startButtonText })
    .click();
  await page
    .getByRole("button", { name: onboardingCopy.rejectButtonText })
    .click();
  await page
    .getByRole("button", { name: onboardingCopy.closeDialogButtonText })
    .click();
}
