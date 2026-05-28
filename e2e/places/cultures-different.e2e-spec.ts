import { test } from "@playwright/test";
import { expect } from "../setup/test-fixture";
import { waitUntilMapIsLoaded } from "../utils/wait";
import { skipOnboarding } from "../utils/control-onboarding";

test.beforeEach(async ({ page }) => {
  //await mockTranslations(page);
  await page.goto("/");
  await waitUntilMapIsLoaded(page);
  await skipOnboarding(page);
});

test.describe("Culture is Artwork", () => {
  test("Waffen", async ({ page }) => {
    await page.goto(
      "/amenities/node:10623971027?position%5Blatitude%5D=52.5240477&position%5Blongitude%5D=13.3574680&position%5Bzoom%5D=16.0000000",
    );
    await expect(page.getByRole("heading", { name: "Waffen" })).toBeVisible();
    await expect(page.getByText("Artwork")).toBeVisible();

    //there is twice the word "Material", one after the other
    await expect(
      page.locator("div").filter({ hasText: /^Material$/ }),
    ).toBeVisible();
    await expect(
      page.locator("span").filter({ hasText: "Material" }),
    ).toBeVisible();
    await expect(
      page.getByTestId("general-osm-section").locator("header"),
    ).toBeVisible();
    await expect(page.getByText("bronze,_beton")).toBeVisible();
  });

  test("Worship as a place", async ({ page }) => {
    await page.goto(
      "/amenities/way:419230744?position%5Blatitude%5D=52.55403053&position%5Blongitude%5D=13.34607153&position%5Bzoom%5D=18.00000000",
    );
    await expect(
      page.getByRole("heading", { name: "Place Of Worship" }),
    ).toBeVisible();

    await expect(page.getByText("Operator")).toBeVisible();
    await expect(page.getByText("Paul Gerhardt Stift Soziales")).toBeVisible();
    await expect(
      page.getByRole("list").filter({ hasText: "Open image" }),
    ).toBeVisible();
  });

  test("Zukuntshaus Wedding", async ({ page }) => {
    await page.goto(
      "/amenities/node:6010004388?position%5Blatitude%5D=52.55403053&position%5Blongitude%5D=13.34607153&position%5Bzoom%5D=18.00000000",
    );

    await expect(
      page.getByRole("heading", { name: "Zukunftshaus Wedding" }),
    ).toBeVisible();
    await expect(page.getByText("Community Center")).toBeVisible();

    await expect(page.getByText("Access", { exact: true })).toBeVisible();
    await expect(
      page.getByText("Fully wheelchair accessible 👍"),
    ).toBeVisible();
    await expect(page.getByText("WC", { exact: true })).toBeVisible();
    await expect(page.getByText("Wheelchair accessible WC")).toBeVisible();

    //the word "community_centre" is joint with underscore
    await expect(page.getByText("community_centre")).toBeVisible();
    await expect(page.getByText("Village Hall")).toBeVisible();
    await expect(page.getByText("Operator")).toBeVisible();
    await expect(page.getByText("Paul Gerhardt Stift Soziales")).toBeVisible();

    await expect(
      page.getByRole("link", { name: "Müllerstraße 56-58, Berlin-" }),
    ).toBeVisible();
  });

  test("Museum in der Kulturbrauerei", async ({ page }) => {
    await page.goto(
      "/amenities/way:132555271?position%5Blatitude%5D=52.54020601&position%5Blongitude%5D=13.41346142&position%5Bzoom%5D=19.12572489",
    );
    await expect(
      page.getByRole("heading", { name: "Museum in der Kulturbrauerei" }),
    ).toBeVisible();
    await expect(page.getByText("Museum", { exact: true })).toBeVisible();

    await expect(page.getByText("Open", { exact: true })).toBeVisible();
    await expect(
      page.getByText(/Tuesday-Friday \d{2}:\d{2}-\d{2}:\d{2}/),
    ).toBeVisible();
    await expect(
      page.getByText(/Saturday-Sunday \d{2}:\d{2}-\d{2}:\d{2}/),
    ).toBeVisible();
    await expect(page.getByText("Payment")).toBeVisible();
    await expect(page.getByText("No fees")).toBeVisible();
    await expect(page.getByText("Operator")).toBeVisible();
    await expect(page.getByText("Stiftung Haus der Geschichte")).toBeVisible();

    await expect(
      page.getByRole("link", { name: "Knaackstraße 97, Berlin (" }),
    ).toBeVisible();
  });

  test("Cologne Cathedral", async ({ page }) => {
    await page.goto(
      "/?position%5Blatitude%5D=50.94130700&position%5Blongitude%5D=6.95811120&position%5Bzoom%5D=18.11593532&search=K%C3%B6lner+Dom",
    );
    await expect(
      page.getByRole("searchbox", { name: "Search for place or address" }),
    ).toBeVisible();
    await page.goto("/?search=Kölner Dom");

    await expect(
      page.getByRole("heading", { name: "Cologne Cathedral" }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { name: "Cologne Cathedral" }),
    ).toBeVisible();
    await expect(page.getByText("Place Of Worship")).toBeVisible();
    await page.goto(
      "/amenities/way:4532022?position%5Blatitude%5D=50.94130700&position%5Blongitude%5D=6.95811120&position%5Bzoom%5D=18.11593532&search=",
    );
    await expect(page.getByText("Access", { exact: true })).toBeVisible();
    await expect(
      page.getByText("Fully wheelchair accessible 👍"),
    ).toBeVisible();

    await expect(page.getByText("Behindertentoilette auf der S")).toBeVisible();

    await expect(page.getByText("WC", { exact: true })).toBeVisible();
    await expect(page.getByText("Wheelchair accessible WC")).toBeVisible();
  });
});
