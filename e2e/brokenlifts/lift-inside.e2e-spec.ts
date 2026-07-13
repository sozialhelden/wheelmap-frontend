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

test.describe("Broken Lifts", async () => {
  test("one lift only - S+U-Bahnhof Hauptbahnhof", async ({ page }) => {
    await page.goto(
      "https://main-brokenlifts.d.wheelmap.tech/station/de:11000:900003201/4723",
    );

    await expect(
      page.getByRole("heading", { name: "Informationen zum Aufzug" }),
    ).toBeVisible();
    await expect(page.getByText("Eigentümer:")).toBeVisible();
    await expect(page.getByText("DB InfraGO").first()).toBeVisible();
    await expect(page.getByText("Daten bereitgestellt von:")).toBeVisible();
    await expect(page.getByText("DB InfraGO").nth(1)).toBeVisible();
    await expect(page.getByText("operatorInfo.label.contact")).toBeVisible();
    await expect(page.getByText("DB InfraGO").nth(2)).toBeVisible();

    //await expect(page.getByText('Der Aufzug ist außer Betrieb.')).toBeVisible();
    await expect(
      page.getByText("Der Aufzug steht zur Verfügung."),
    ).toBeVisible();
    await expect(page.getByText("Aufzug zwischen Regional- und")).toBeVisible();

    await expect(
      page.getByRole("heading", { name: "Letzte Meldungen" }),
    ).toBeVisible();
    await expect(page.getByText("Störungsmeldung")).toBeVisible();

    await expect(page.getByText("Gemeldet am 7.7.2026, 16:55")).toBeVisible();
    await expect(page.getByText("repariert am 9.7.2026, 15:13")).toBeVisible();
    await expect(page.getByText("Außer Betrieb").first()).toBeVisible();
    await expect(page.getByText("Gemeldet am 12.6.2026, 15:13")).toBeVisible();
    await expect(page.getByText("repariert am 19.6.2026, 15:19")).toBeVisible();
    await expect(page.getByText("Außer Betrieb").nth(1)).toBeVisible();
    await expect(page.getByText("Gemeldet am 31.3.2026, 07:06")).toBeVisible();
    await expect(page.getByText("repariert am 31.3.2026, 07:30")).toBeVisible();
    await expect(page.getByText("Außer Betrieb").nth(2)).toBeVisible();

    await expect(
      page.getByRole("button", { name: "Umgebungskarte" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Umgebungskarte" }).click();
    await page.goto(
      "https://main-brokenlifts.d.wheelmap.tech/station/de:11000:900003201/4723#map",
    );

    //await expect(page.locator('.leaflet-container')).toBeVisible();
    await page.getByRole("button", { name: "Marker" }).nth(5).click();
    await expect(
      page.getByRole("button", { name: "Karte schließen" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Karte schließen" }).click();

    await expect(
      page.getByRole("button", { name: "Umgebungskarte" }),
    ).toBeVisible();
  });
});
