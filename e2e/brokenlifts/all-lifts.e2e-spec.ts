import { test } from "@playwright/test";
import { expect } from "../setup/test-fixture";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.goto("https://main-brokenlifts.d.wheelmap.tech/stations");
});

//this is a test for the overview page of the broken lifts. It tests if the overview page
// is displayed correctly and if the links to the other pages are working.
test.describe("Broken Lifts Overview", async () => {
  test("Several lifts are displayed", async ({ page }) => {
    //all lifts overview page
    await expect(
      page.getByRole("heading", { name: "Alle Aufzüge" }),
    ).toBeVisible();
    // Check that the page has loaded and the list of lifts is visible
    await expect(page.getByText("Hier findest du eine Ü")).toBeVisible();

    await expect(
      page.getByText(/Aktuell sind \d+ von \d+ Aufzü/),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Aktuelle Störungen" }),
    ).toBeVisible();
    await expect(
      page.getByText(/Letzte Aktualisierung am \d+\.\d+/),
    ).toBeVisible();

    await expect(page.getByText("Station", { exact: true })).toBeVisible();
    await expect(page.getByText("Aufzüge", { exact: true })).toBeVisible();
    await expect(page.getByText("Status", { exact: true })).toBeVisible();
    await page.getByRole("link", { name: "Aktuelle Störungen" }).click();

    //another view of the broken lifts
    await expect(
      page.getByRole("heading", { name: "BrokenLifts" }),
    ).toBeVisible();
    await expect(page.getByText("Finde heraus, welche Aufzüge")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Alle Stationen" }),
    ).toBeVisible();
  });
});
