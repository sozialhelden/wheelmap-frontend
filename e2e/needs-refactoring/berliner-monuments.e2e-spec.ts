import { expect, test } from "~/tests/e2e/setup/test-fixture";

import { skipOnMobiles } from "./lib/device-type";

test.beforeEach(async ({ page }) => {
  // Go to the starting url before each test.
  //await page.goto(baseURL);
  //await skipOnboarding(page);
});

test.skip("opens Victory Column on OpenStreetMap", async ({ page }) => {
  await page.goto(
    "https://feature-a11ymap.wheelmap.tech/composite/ac:PlaceInfo:WcdW6a8tJumrqsswk,buildings:way:718035022",
  );
  await page.waitForLoadState();
  //goto Open Street Map
  await page.getByRole("link", { name: "Open on OpenStreetMap" }).click();
  await page.waitForLoadState();
  skipOnMobiles();
  await expect(
    page.getByRole("heading", { name: "Großer Stern" }),
  ).toBeVisible();
  await expect(page.getByText("Victory Column")).toBeVisible();
  await page.waitForLoadState();
});

test.skip("opens Victory Column on Bing Maps", async ({ page }) => {
  //test('Goto Open on Apple Maps', async ({ page }) => {
  await page.goto(
    "https://feature-a11ymap.wheelmap.tech/composite/ac:PlaceInfo:WcdW6a8tJumrqsswk,buildings:way:718035022",
  );
  await page.waitForLoadState();
  skipOnMobiles();
  //goto Bing Maps
  await page.getByRole("link", { name: "Open on Bing Maps" }).click();
  await page.waitForLoadState();
  await expect(
    page.getByRole("heading", { name: "Großer Stern" }),
  ).toBeVisible();
  await expect(page.getByText("Victory Column")).toBeVisible();
  await page.waitForLoadState();
});

test.skip("displays Swiss Embassy address", async ({ page }) => {
  await page.goto(
    "https://feature-a11ymap.wheelmap.tech/composite/amenities:relation:2886766,buildings:relation:2886766",
  );
  await page.waitForLoadState();
  await expect(page.getByText("Otto-von-Bismarck-Allee")).toBeVisible();
  await page.waitForLoadState();
  await expect(
    page.getByRole("heading", { name: "Embassy of Switzerland" }),
  ).toBeVisible();
});

test.skip("displays Swiss Embassy website link", async ({ page }) => {
  await page.goto(
    "https://feature-a11ymap.wheelmap.tech/composite/amenities:relation:2886766,buildings:relation:2886766",
  );
  await page.waitForLoadState();
  await expect(
    page.getByText("https://www.eda.admin.ch/berlin.html"),
  ).toBeVisible();
  await page.goto("http://www.eda.admin.ch/berlin.html");
  await page.waitForLoadState();
  await expect(
    page.locator("text=Schweiz und Deutschland").first(),
  ).toBeVisible();
});

test.skip("displays Swiss Embassy phone number", async ({ page }) => {
  await page.goto(
    "https://feature-a11ymap.wheelmap.tech/composite/amenities:relation:2886766,buildings:relation:2886766",
  );
  await page.waitForLoadState();
  await expect(page.getByText("Call +49 30 390 40 00")).toBeVisible();
  await page.waitForLoadState();
  await page.locator("text=Call +49 30 390 40 00").first().click();
  await page.waitForLoadState();
});
