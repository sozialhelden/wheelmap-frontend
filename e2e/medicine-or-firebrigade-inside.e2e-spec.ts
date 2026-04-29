import { expect, type Page, test } from "@playwright/test";

// Helper to dismiss onboarding dialog
async function dismissOnboarding(page: Page) {
  await page.waitForLoadState("networkidle");
}

test.describe("any danger inside", () => {
  test.beforeEach(async ({ page: Page }) => {
    await Page.goto("/");
    await dismissOnboarding(Page);
  });

  test("should show if there is a main station inside", async ({ page }) => {
    await page.goto(
      "https://beta.wheelmap.org/amenities/node:3856100103?position%5Blatitude%5D=52.5249451&position%5Blongitude%5D=13.3696614&position%5Bzoom%5D=15.0000000&search=",
    );

    await page.waitForLoadState("networkidle");

    // Warte auf das Laden der Ortsdetails
    await expect(page.getByRole("heading").first()).toBeVisible();

    // Warte zusätzlich etwas für den Fall, dass es Verzögerungen gibt
    await page.waitForTimeout(2000);

    await expect(
      page.getByRole("heading", {
        name: "Berlin Central Station",
      }),
    ).toBeVisible();
    await page
      .locator('[data-testid="feature-header"] button')
      .dispatchEvent("click");
    await page.locator(".sc-68ee39ca-2").click();

    await expect(
      page.getByRole("heading", { name: "Berlin Central Station" }),
    ).toBeVisible();
    await expect(page.getByText("Train Station")).toBeVisible();
    await expect(page.getByText("Hauptbahnhof der")).toBeVisible();

    await expect(page.getByText("Means of transport🚊 Train")).toBeVisible();
    await expect(page.getByText("Internet")).toBeVisible();
    await expect(page.getByText("Wifi")).toBeVisible();
    await expect(page.getByText("Free")).toBeVisible();

    await expect(page.getByText("Passenger info")).toBeVisible();
    await expect(page.getByText("Realtime departures board")).toBeVisible();

    //twice the mention of "Speech output", should be reduced to one
    await page.locator("span").filter({ hasText: "Speech output" }).click();
    await page
      .getByTestId("general-osm-section")
      .locator("header")
      .filter({ hasText: "Speech output" })
      .click();
    await expect(page.getByText("No speech output available 🔇")).toBeVisible();

    await expect(page.getByText("Operator")).toBeVisible();
    await expect(page.getByText("DB InfraGO AG")).toBeVisible();

    //"Part of" is shown vers the end - ???
  });

  test("should show if there is a bus stop via Wiener Straße, Kassel inside", async ({
    page,
  }) => {
    await page.goto(
      "https://beta.wheelmap.org/composite/amenities:node:320683916,amenities:node:9963239812,amenities:node:9963239813?position%5Blatitude%5D=51.3342320&position%5Blongitude%5D=9.4944970&position%5Bzoom%5D=15.0000000",
    );
    await page.waitForLoadState("networkidle");

    // Warte auf das Laden der Ortsdetails
    await expect(page.getByRole("heading").first()).toBeVisible();

    // Warte zusätzlich etwas für den Fall, dass es Verzögerungen gibt
    await page.waitForTimeout(2000);

    await expect(
      page.getByRole("heading", {
        name: "Wiener Straße",
      }),
    ).toBeVisible();
    await page
      .locator('[data-testid="feature-header"] button')
      .dispatchEvent("click");
    await page.locator(".sc-68ee39ca-2").click();

    await expect(
      page.getByRole("heading", { name: "Wiener Straße" }),
    ).toBeVisible();

    await expect(page.getByText("Bus Stop")).toBeVisible();
    await expect(page.getByText("Means of transport")).toBeVisible();
    await expect(page.getByText("🚍 Bus")).toBeVisible();
    await expect(page.getByText("🚉 Tram")).toBeVisible();

    await expect(page.getByText("Amenities")).toBeVisible();
    await expect(page.getByText("Bin 🚮")).toBeVisible();
    await expect(page.getByText("Lighting available 🔆")).toBeVisible();
    await expect(page.getByText("Bench available")).toBeVisible();
    await expect(page.getByText("Shelter available")).toBeVisible();
    await expect(page.getByText("Tactile pavement available🦯")).toBeVisible();

    await expect(page.getByText("Ground")).toBeVisible();
    await expect(page.getByText("Raised kerb")).toBeVisible();
    await expect(page.getByText("Vehicles can approach the")).toBeVisible();

    await expect(page.getByText("Passenger info")).toBeVisible();
    await expect(page.getByText("Real-time display")).toBeVisible();
    await expect(page.getByText("Speech output available 💬📢")).toBeVisible();
  });

  test("should show if there is a bus stop via Rudolf-Mosse-Platz inside", async ({
    page,
  }) => {
    await page.goto(
      "https://beta.wheelmap.org/composite/amenities:node:277023123?position%5Blatitude%5D=52.4745196&position%5Blongitude%5D=13.3031469&position%5Bzoom%5D=16.3604955",
    );
    await page.waitForLoadState("networkidle");

    // Warte auf das Laden der Ortsdetails
    await expect(page.getByRole("heading").first()).toBeVisible();

    // Warte zusätzlich etwas für den Fall, dass es Verzögerungen gibt
    await page.waitForTimeout(2000);

    await expect(
      page.getByRole("heading", {
        name: "Rudolf-Mosse-Platz",
      }),
    ).toBeVisible();
    await page
      .locator('[data-testid="feature-header"] button')
      .dispatchEvent("click");
    await page.locator(".sc-68ee39ca-2").click();

    await expect(
      page.getByRole("heading", { name: "Rudolf-Mosse-Platz" }),
    ).toBeVisible();
    await expect(page.getByText("Bus Stop")).toBeVisible();
    await expect(page.getByText("Amenities")).toBeVisible();
    await expect(page.getByText("Bin 🚮")).toBeVisible();
    await expect(page.getByText("Lighting available 🔆")).toBeVisible();
    await expect(page.getByText("Bench available")).toBeVisible();
    await expect(page.getByText("Shelter available")).toBeVisible();
    await expect(page.getByText("No tactile pavement")).toBeVisible();
  });

  test("should show if there is a bus station of Steglitz inside", async ({
    page,
  }) => {
    await page.goto(
      "https://beta.wheelmap.org/amenities/node:3956502026?position%5Blatitude%5D=52.4565164&position%5Blongitude%5D=13.3200976&position%5Bzoom%5D=15.0000000&search=",
    );
    await page.waitForLoadState("networkidle");

    // Warte auf das Laden der Ortsdetails
    await expect(page.getByRole("heading").first()).toBeVisible();

    // Warte zusätzlich etwas für den Fall, dass es Verzögerungen gibt
    await page.waitForTimeout(2000);

    await expect(
      page.getByRole("heading", {
        name: "S+U Rathaus Steglitz",
      }),
    ).toBeVisible();

    await page
      .locator('[data-testid="feature-header"] button')
      .dispatchEvent("click");
    await page.locator(".sc-68ee39ca-2").click();

    await expect(
      page.getByRole("heading", { name: "S+U Rathaus Steglitz" }),
    ).toBeVisible();
    await expect(page.getByText("Bus Stop")).toBeVisible();

    await expect(page.getByText("Means of transport")).toBeVisible();
    await expect(page.getByText("🚍 Bus")).toBeVisible();

    await expect(page.getByText("Amenities")).toBeVisible();
    await expect(page.getByText("No bin.")).toBeVisible();

    await expect(page.getByText("The place is not lit.")).toBeVisible();
    await expect(page.getByText("Bench available")).toBeVisible();
    await expect(page.getByText("Shelter available")).toBeVisible();
    await expect(page.getByText("Tactile pavement available🦯")).toBeVisible();
  });

  test("should show if there is a dentist inside", async ({ page }) => {
    await page.goto(
      "https://beta.wheelmap.org/amenities/node:4773307934?position%5Blatitude%5D=52.51096700&position%5Blongitude%5D=13.45586362&position%5Bzoom%5D=17.43115730",
    );

    await page.waitForLoadState("networkidle");

    // Warte auf das Laden der Ortsdetails
    await expect(page.getByRole("heading").first()).toBeVisible();

    // Warte zusätzlich etwas für den Fall, dass es Verzögerungen gibt
    await page.waitForTimeout(2000);

    await expect(
      page.getByRole("heading", {
        name: "Dr. Gerald Keller und Dr.",
      }),
    ).toBeVisible();
    await page
      .locator('[data-testid="feature-header"] button')
      .dispatchEvent("click");
    await page.locator(".sc-68ee39ca-2").click();

    await expect(
      page.getByRole("heading", { name: "Dr. Gerald Keller und Dr." }),
    ).toBeVisible();
    await expect(
      page.getByTestId("feature-header").getByText("Dentist"),
    ).toBeVisible();

    await expect(page.getByText("Services")).toBeVisible();
    await expect(
      page.getByTestId("general-osm-section").getByText("Dentist"),
    ).toBeVisible();
  });

  test("should show if there is a normal doctor inside", async ({ page }) => {
    await page.goto(
      "https://beta.wheelmap.org/amenities/node:7712040247?position%5Blatitude%5D=52.5119062&position%5Blongitude%5D=13.4949982&position%5Bzoom%5D=16.7625268&search=",
    );

    await page.waitForLoadState("networkidle");

    // Warte auf das Laden der Ortsdetails
    await expect(page.getByRole("heading").first()).toBeVisible();

    // Warte zusätzlich etwas für den Fall, dass es Verzögerungen gibt
    await page.waitForTimeout(2000);

    await expect(
      page.getByRole("heading", {
        name: "Dr. med. Andreas Kromer",
      }),
    ).toBeVisible();
    await page
      .locator('[data-testid="feature-header"] button')
      .dispatchEvent("click");
    await page.locator(".sc-68ee39ca-2").click();

    await expect(
      page.getByRole("heading", { name: "Dr. med. Andreas Kromer" }),
    ).toBeVisible();
    await expect(page.getByText("Ser")).toBeVisible();
    await expect(
      page.getByTestId("general-osm-section").getByText("Doctor"),
    ).toBeVisible();
    await expect(page.getByText("Dermatology")).toBeVisible();
  });

  test("should show if there is a psychologist inside", async ({ page }) => {
    await page.goto(
      "https://beta.wheelmap.org/composite/amenities:node:12475794363,amenities:node:7844240265,amenities:node:7844240264,amenities:node:12475794360?position%5Blatitude%5D=52.5119062&position%5Blongitude%5D=13.4949982&position%5Bzoom%5D=16.7625268",
    );

    await page.waitForLoadState("networkidle");

    // Warte auf das Laden der Ortsdetails
    await expect(page.getByRole("heading").first()).toBeVisible();

    // Warte zusätzlich etwas für den Fall, dass es Verzögerungen gibt
    await page.waitForTimeout(2000);

    await expect(
      page.getByRole("heading", {
        name: "Dr. Dipl.-Psych. Johanna",
      }),
    ).toBeVisible();
    await page
      .locator('[data-testid="feature-header"] button')
      .dispatchEvent("click");
    await page.locator(".sc-68ee39ca-2").click();

    await expect(
      page.getByRole("heading", { name: "Dr. Dipl.-Psych. Johanna" }),
    ).toBeVisible();
    await expect(page.getByText("Psychotherapist")).toBeVisible();
    await expect(page.getByText("Services")).toBeVisible();
    await expect(page.getByText("Psychotherapy")).toBeVisible();
    await expect(page.getByText("Child and adolescent")).toBeVisible();
  });
});
