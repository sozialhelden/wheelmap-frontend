import { test } from "@playwright/test";
import { expect } from "../setup/test-fixture";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

//This test goes inside a lift page and checks if the information about the lift is displayed correctly. It also checks if the map is displayed correctly and if the map can be closed and opened again.
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
    await expect(page.getByText("Service-Kontakt:")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "feedback@bahnhof.de" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "030" })).toBeVisible();

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
      page.getByRole("button", { name: "Lage auf der Umgebungskarte" }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Lage auf der Umgebungskarte" })
      .click();
    await page.goto(
      "https://main-brokenlifts.d.wheelmap.tech/station/de:11000:900003201/4723#map",
    );

    await expect(page.locator(".leaflet-container")).toBeVisible();
    await page.getByRole("button", { name: "Marker" }).nth(5).click();
    await expect(
      page.getByRole("button", { name: "Karte schließen" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Karte schließen" }).click();

    await expect(
      page.getByRole("button", { name: "Lage auf der Umgebungskarte" }),
    ).toBeVisible();
  });
});
