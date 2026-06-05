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
  test("should show Dussmann the Culture Department Store", async ({
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
});
