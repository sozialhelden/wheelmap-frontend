import { test } from "@playwright/test";
import { expect } from "../setup/test-fixture";
import { waitUntilMapIsLoaded } from "../utils/wait";
import { skipOnboarding } from "../utils/control-onboarding";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  //await waitUntilMapIsLoaded(page);
  //await skipOnboarding(page);
});

test.describe("Broken Lifts", async () => {
  test("full name", async ({ page }) => {
    await page.goto("/main-brokenlifts.d.wheelmap.tech/");

    await page
      .getByRole("searchbox", { name: "Search the site" })
      .fill("U Kleistpark");
    await page.getByRole("button", { name: "Search" }).click();
    await page.getByRole("link", { name: "U Kleistpark" }).click();
  });

  test("less than full name", async ({ page }) => {
    await page.goto("/main-brokenlifts.d.wheelmap.tech/");

    await page
      .getByRole("searchbox", { name: "Search the site" })
      .fill("leistpar");
    await page.getByRole("button", { name: "Search" }).click();
    await page.getByRole("link", { name: "leistpar" }).click();
  });

  test.skip("more than full name", async ({ page }) => {
    await page.goto("/main-brokenlifts.d.wheelmap.tech/");

    await page
      .getByRole("searchbox", { name: "Search the site" })
      .fill("U-Bahnhof Kleistpark");
    await page.getByRole("button", { name: "Search" }).click();
    await page.getByRole("link", { name: "U-Bahnhof Kleistpark" }).click();
  });
});
