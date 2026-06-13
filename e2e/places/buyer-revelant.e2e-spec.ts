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

test.describe("Buyer Relevant Places", () => {
  test("should show Dussmann the Culture Department Store at Friedrichstraße 90", async ({
    page,
  }) => {
    await page.goto(
      "/amenities/way:32898110?position%5Blatitude%5D=52.51837843&position%5Blongitude%5D=13.38848730&position%5Bzoom%5D=19.10369540",
    );
    await expect(
      page.getByRole("heading", { name: "Dussmann das KulturKaufhaus" }),
    ).toBeVisible();

    await expect(page.getByText("Open", { exact: true })).toBeVisible();
    await expect(page.getByText("Monday-Friday 09:00-24:")).toBeVisible();
    await expect(page.getByText("Saturday 09:00-23:")).toBeVisible();

    await expect(page.getByText("Stay")).toBeVisible();
    await expect(page.getByText("Air conditioned.")).toBeVisible();

    await expect(page.getByText("Payment")).toBeVisible();
    await expect(page.getByText("Debit card")).toBeVisible();
    await expect(page.getByText("Credit card")).toBeVisible();

    await expect(page.getByText("Look")).toBeVisible();
    await expect(page.getByText("↕7 levels")).toBeVisible();

    await expect(page.getByText("Internet")).toBeVisible();
    await expect(page.getByText("Wifi", { exact: true })).toBeVisible();
    await expect(page.getByText("Free", { exact: true })).toBeVisible();
    await expect(page.getByText("Wifi name (SSID")).toBeVisible();
    await expect(page.getByText("KulturKaufhaus free-Wifi")).toBeVisible();

    await expect(page.getByText("Operator")).toBeVisible();
    await expect(
      page.getByText("Dussmann das KulturKaufhaus GmbH"),
    ).toBeVisible();
  });

  test("should show ALDI at the Friedrichstraße 149", async ({ page }) => {
    await page.goto(
      "/composite/amenities:node:9798282713?position%5Blatitude%5D=52.51837843&position%5Blongitude%5D=13.38848730&position%5Bzoom%5D=19.10369540",
    );
    await expect(page.getByRole("heading", { name: "Aldi" })).toBeVisible();
    await expect(page.getByText("Open", { exact: true })).toBeVisible();
    await expect(page.getByText("Monday-Saturday 07:00-21:")).toBeVisible();
    await expect(page.getByText("public holiday closed")).toBeVisible();

    await expect(page.getByText("Location")).toBeVisible();
    await expect(page.getByText("Basement floor")).toBeVisible();

    await expect(page.getByText("Operator")).toBeVisible();
    await expect(page.getByText("ALDI N")).toBeVisible();
  });

  test("should show a Drugstore/dm at the Friedrichstraße 147 ", async ({
    page,
  }) => {
    await page.goto(
      "/amenities/node:1349696699?position%5Blatitude%5D=52.51837843&position%5Blongitude%5D=13.38848730&position%5Bzoom%5D=19.10369540",
    );

    await expect(page.getByRole("heading", { name: "dm" })).toBeVisible();
    await expect(page.getByText("Drugstore")).toBeVisible();
    await expect(page.getByText("Open", { exact: true })).toBeVisible();

    await expect(page.getByText("Access", { exact: true })).toBeVisible();
    await expect(
      page.getByText("Fully wheelchair accessible 👍"),
    ).toBeVisible();
    await expect(page.getByTestId("wheelchair-editor__button")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Add a description" }),
    ).toBeVisible();
    //twice the pen - fault of the test data

    await expect(page.getByText("Monday-Friday 07:00-22:")).toBeVisible();
    await expect(page.getByText("Saturday 09:00-22:")).toBeVisible();

    await expect(page.getByText("Location")).toBeVisible();
    await expect(page.getByText("Ground floor")).toBeVisible();

    await expect(page.getByText("Payment")).toBeVisible();
    await expect(page.getByText("With Cash")).toBeVisible();
    await expect(page.getByText("Debit card")).toBeVisible();
    await expect(page.getByText("Credit card")).toBeVisible();
  });

  test("should show a Drugstore/Rossmann at the Friedrichstraße 90 ", async ({
    page,
  }) => {
    await page.goto(
      "/composite/amenities:node:1308877468?position%5Blatitude%5D=52.51837843&position%5Blongitude%5D=13.38848730&position%5Bzoom%5D=19.10369540",
    );

    await expect(page.getByRole("heading", { name: "Rossmann" })).toBeVisible();
    await expect(page.getByText("Drugstore")).toBeVisible();

    await expect(page.getByText("Access", { exact: true })).toBeVisible();
    await expect(page.getByText("Partially wheelchair")).toBeVisible();
    await expect(page.getByTestId("wheelchair-editor__button")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Add a description" }),
    ).toBeVisible();
    //twice the pen - fault of the test data

    await expect(page.getByText("Open", { exact: true })).toBeVisible();
    await expect(page.getByText("Monday-Friday 07:00-22:")).toBeVisible();
    await expect(page.getByText("Saturday 08:00-22:")).toBeVisible();
    await expect(page.getByText("public holiday closed")).toBeVisible();

    await expect(page.getByText("Payment")).toBeVisible();
    await expect(page.getByText("With Cash")).toBeVisible();
    await expect(page.getByText("VISA")).toBeVisible();
    await expect(page.getByText("Credit card")).toBeVisible();
    await expect(page.getByText("With coins")).toBeVisible();
    await expect(page.getByText("Maestro")).toBeVisible();
    await expect(page.getByText("MasterCard")).toBeVisible();
    await expect(page.getByText("Debit card")).toBeVisible();
    await expect(page.getByText("Credit card")).toBeVisible();

    await expect(page.getByText("Operator")).toBeVisible();
    await expect(page.getByText("Dirk Rossmann GmbH")).toBeVisible();
  });

  test("should show a pharmacy at the Friedrichstraße 151", async ({
    page,
  }) => {
    await page.goto(
      "/amenities/node:380498298?position%5Blatitude%5D=52.51837843&position%5Blongitude%5D=13.38848730&position%5Bzoom%5D=19.10369540",
    );
    await expect(
      page.getByRole("heading", { name: "Dorotheenstadt Apotheke" }),
    ).toBeVisible();
    await expect(
      page.getByTestId("feature-header").getByText("Pharmacy"),
    ).toBeVisible();

    await expect(page.getByText("Access", { exact: true })).toBeVisible();
    await expect(
      page.getByText("Fully wheelchair accessible 👍"),
    ).toBeVisible();
    await expect(page.getByTestId("wheelchair-editor__button")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Add a description", exact: true }),
    ).toBeVisible();
    //twice the pen

    await expect(page.getByText("WC", { exact: true })).toBeVisible();
    await expect(page.getByText("No wheelchair-accessible WC")).toBeVisible();
    await expect(
      page.getByTestId("toilets-wheelchair-editor__button"),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Add a description for this" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Next wheelchair-accessible WC" }),
    ).toBeVisible();
    //twice the pen

    await expect(page.getByText("Open", { exact: true })).toBeVisible();
    await expect(page.getByText("Monday-Friday 08:00-19:")).toBeVisible();
    await expect(page.getByText("Saturday 09:00-14:")).toBeVisible();

    await expect(page.getByText("Services")).toBeVisible();
    await expect(page.getByText("Dispenses prescription drugs")).toBeVisible();
    await expect(
      page.getByTestId("general-osm-section").getByText("Pharmacy"),
    ).toBeVisible();

    await expect(page.getByText("Operator")).toBeVisible();
    await expect(page.getByText("Ulrike Uhlig")).toBeVisible();

    await expect(page.getByRole("link", { name: "Open image" })).toBeVisible();
  });

  test("should show a Zara clothes store at the Friedrichstraße 88", async ({
    page,
  }) => {
    await page.goto(
      "/composite/amenities:node:1336721454?position%5Blatitude%5D=52.51837843&position%5Blongitude%5D=13.38848730&position%5Bzoom%5D=19.10369540",
    );
    await expect(page.getByRole("heading", { name: "Zara" })).toBeVisible();
    await expect(page.getByText("Clothing Store")).toBeVisible();

    await expect(page.getByText("Open", { exact: true })).toBeVisible();
    await expect(page.getByText("Monday-Saturday 10:00-20:")).toBeVisible();
  });
});
