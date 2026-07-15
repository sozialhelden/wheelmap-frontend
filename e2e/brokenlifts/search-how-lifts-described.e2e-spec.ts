import { test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

//this is a test for the search functionality of the broken lifts page. It tests if the search
// works with full name, less than full name and more than full name of the lift.
test.describe("Broken Lifts", async () => {
  test("full name", async ({ page }) => {
    await page.goto("https://main-brokenlifts.d.wheelmap.tech/");

    await page
      .getByRole("searchbox", { name: "Search the site" })
      .fill("U Kleistpark");
    await page.getByRole("button", { name: "Search" }).click();
    await page.getByRole("link", { name: "U Kleistpark" }).click();
  });

  test("less than full name", async ({ page }) => {
    await page.goto("https://main-brokenlifts.d.wheelmap.tech/");

    await page
      .getByRole("searchbox", { name: "Search the site" })
      .fill("leistpar");
    await page.getByRole("button", { name: "Search" }).click();
    await page.getByRole("link", { name: "leistpar" }).click();
  });

  test.skip("more than full name", async ({ page }) => {
    await page.goto("https://main-brokenlifts.d.wheelmap.tech/");

    await page
      .getByRole("searchbox", { name: "Search the site" })
      .fill("U-Bahnhof Kleistpark");
    await page.getByRole("button", { name: "Search" }).click();
    await page.getByRole("link", { name: "U-Bahnhof Kleistpark" }).click();
  });
});
