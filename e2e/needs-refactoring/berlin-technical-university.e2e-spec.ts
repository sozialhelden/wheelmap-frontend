import { expect, test } from "~/tests/e2e/setup/test-fixture";

test.beforeEach(async ({ page }) => {
  // Go to the starting url before each test.
  // await page.goto(baseURL);
  // await skipOnboarding(page);
  // console.log(`Playwright config: ${JSON.stringify(test.info().config, null, 2)}`);
  // console.log(process.env.CI_TEST_DEPLOYMENT_BASE_URL);
});

test.skip("should allow editing accessibility status from partially accessible to fully accessible for TU Berlin ER building", async ({
  page,
}) => {
  await page.goto(
    "/buildings/way%3A23517902?category=&q=&wheelchair=unknown&toilet=yes&lat=52.51096600&lon=13.32576500&extent=13.3248001&extent=52.5113331&extent=13.3267297&extent=52.5105994&zoom=18.74388041",
  );
  await page.waitForLoadState();
  await page.getByText("ER", { exact: true }).click();
  await page.waitForLoadState();
  await page.getByText("University building").click();
  await page.waitForLoadState();
  await page.click('text="Access"');
  await page.click('text="Partially wheelchair accessible"');
  await page.waitForLoadState();
  await expect(page.getByRole("button", { name: "Edit" })).toBeVisible();
});

test.skip("should display building floor information showing 4 levels when clicking Look section", async ({
  page,
}) => {
  await page.goto(
    "/buildings/way%3A23517902?category=&q=&wheelchair=unknown&toilet=yes&lat=52.51096600&lon=13.32576500&extent=13.3248001&extent=52.5113331&extent=13.3267297&extent=52.5105994&zoom=18.74388041",
  );
  await page.waitForLoadState();
  await page.click('text="Look"');
  await page.waitForLoadState();
  await expect(page.getByText("4 levels")).toBeVisible();
  await page.waitForLoadState();
});

test.skip("should display Technische Universität Berlin as building operator when clicking Operator section", async ({
  page,
}) => {
  await page.goto(
    "/buildings/way%3A23517902?category=&q=&wheelchair=unknown&toilet=yes&lat=52.51096600&lon=13.32576500&extent=13.3248001&extent=52.5113331&extent=13.3267297&extent=52.5105994&zoom=18.74388041",
  );
  await page.waitForLoadState();
  await page.click('text="Operator"');
  await page.waitForLoadState();
  await page.click('text="Technische Universität Berlin"');
  await page.waitForLoadState();
  await expect(page.getByText("Technische Universität Berlin")).toBeVisible();
  await page.waitForLoadState();
});

test.skip("should display user review comments with MySmiley integration for ER University building", async ({
  page,
}) => {
  await page.goto(
    "/buildings/way%3A23517902?category=&q=&wheelchair=unknown&toilet=yes&lat=52.51096600&lon=13.32576500&extent=13.3248001&extent=52.5113331&extent=13.3267297&extent=52.5105994&zoom=18.74388041",
  );
  await page.waitForLoadState();
  await expect(
    page.getByRole("cell", { name: "🧑 “Es gibt auf der" }),
  ).toBeVisible();
  await page.waitForLoadState();
  await expect(
    page.getByRole("cell", { name: "🧑 “Es gibt auf der" }).getByRole("button"),
  ).toBeVisible();
});

test.skip("should navigate to nearest wheelchair-accessible toilet and edit accessibility information for both non-accessible and accessible WCs", async ({
  page,
}) => {
  await page.goto(
    "/buildings/way%3A23517902?category=&q=&wheelchair=unknown&toilet=yes&lat=52.51096600&lon=13.32576500&extent=13.3248001&extent=52.5113331&extent=13.3267297&extent=52.5105994&zoom=18.74388041",
  );
  await page.waitForLoadState();

  // Navigate to first (non-accessible) toilet
  await page
    .getByRole("link", { name: "Next wheelchair-accessible WC" })
    .click();
  await page.waitForLoadState();

  // Edit first toilet - mark as not wheelchair accessible
  await page.getByText("Access", { exact: true }).click();
  await page.getByText("Not wheelchair accessible").click();
  await page.getByTestId("wheelchair").click();
  //enter into access dialog
  await page.getByText("Not at all").click();
  await page.getByRole("button", { name: "Confirm" }).click();
  await page.waitForLoadState();

  // Fill additional toilet information
  await page.getByText("Payment", { exact: true }).click();
  await page.getByText("No fees").click();
  await page.getByRole("cell", { name: "For whom?", exact: true }).click();
  await page.getByText("Access for customers").click();
  await page
    .getByRole("cell", { name: "Add a description", exact: true })
    .click();
  await page.getByTestId("wheelchair:description:en").click();
  //enter into description dialog
  await page.getByText("Please describe how").click();
  await page.getByRole("button", { name: "Confirm" }).click();
  await page.waitForLoadState();

  // Verify distance updated and navigate to next toilet
  await expect(
    page.getByText("Next wheelchair-accessible WC 0 m"),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Next wheelchair-accessible WC" })
    .click();
  await page.waitForLoadState();

  // Edit second toilet - mark as wheelchair accessible
  await page.getByLabel("Toilets").getByRole("button").click();
  await page.getByText("Toilets").click();
  await page.getByRole("cell", { name: "Access", exact: true }).click();
  await page.getByText("Fully wheelchair accessible").click();
  await page.getByTestId("wheelchair").click();

  // Enter into access dialog
  await page.getByTestId("dialog").getByText("Fully").click();
  await page.getByRole("button", { name: "Confirm" }).click();
  await page.waitForLoadState();
  await page.getByRole("cell", { name: "Location", exact: true }).click();
  await page.getByText("Ground floor").click();
  await page.getByRole("cell", { name: "Payment", exact: true }).click();
  await page.getByText("No fees").click();
  await page.getByRole("cell", { name: "For whom?", exact: true }).click();
  await page.getByText("Access for customers").click();
  await page.getByRole("cell", { name: "WC", exact: true }).click();
  await page.getByText("Accessible WC").click();
  await page.getByTestId("toilets:wheelchair").click();

  // Enter into toilets dialog
  await page.getByText("Is this toilet wheelchair").click();
  await page.getByRole("radio", { name: "Fully" }).click();
  await page.getByRole("button", { name: "Cancel" }).click();
  await page.waitForLoadState();
  await page
    .getByRole("cell", { name: "Add a description", exact: true })
    .click();
  //enter into description dialog
  await page.getByTestId("wheelchair:description:en").click();
  await page.getByText("Please describe how").click();
  await page.getByRole("button", { name: "Confirm" }).click();
  await page.waitForLoadState();
});
