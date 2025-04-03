import type { Page } from "@playwright/test";

export async function skipOnboarding(page: Page) {
  // await page.getByRole("button", { name: "Okay, let’s go!" }).click();
  // await page.getByRole("button", { name: "Skip" }).click();
  // await page.getByRole("button", { name: "Let’s go!" }).click();
}
