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

test.describe("Elevator makes life easier", () => {
  test("Street house number is missing around S-Bahnhof Alexanderplatz", async ({
    page,
  }) => {
    await page.goto(
      "/composite/amenities:node:2095738480?position%5Blatitude%5D=52.52166202&position%5Blongitude%5D=13.41305893&position%5Bzoom%5D=17.62411369",
    );

    await expect(page.getByRole("heading", { name: "Elevator" })).toBeVisible();

    await expect(page.getByText("Location", { exact: true })).toBeVisible();
    await expect(page.getByText("Basement")).toBeVisible();
    await expect(page.getByText("Biking")).toBeVisible();
    await expect(page.getByText("Can be used with bikes 🚲")).toBeVisible();
    await expect(page.getByText("Entrance", { exact: true })).toBeVisible();
    await expect(page.getByText("There is an entrance at this")).toBeVisible();

    await expect(
      page.getByRole("link", { name: "Add new image" }),
    ).toBeVisible();
    await expect(page.getByText("Your good deed of the day!")).toBeVisible();

    await expect(
      page.getByRole("link", { name: "-5;-3;-1;" }).first(),
    ).toBeVisible();
    // '-5;-3;-1;'
    // instead of Bing map ???
  });

  test("Everything is missing around S-Bahnhof Potsdamer Platz", async ({
    page,
  }) => {
    await page.goto(
      "/amenities/node:394948621?position%5Blatitude%5D=52.52166202&position%5Blongitude%5D=13.41305893&position%5Bzoom%5D=17.62411369",
    );
    //   await expect(page.getByRole('heading', { name: 'Elevator' })).toBeVisible();
    //kein Umspringen auf grünes Fahrstuhlbild
  });
});
