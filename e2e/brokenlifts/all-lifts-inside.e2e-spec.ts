import { test } from "@playwright/test";
import { expect } from "../setup/test-fixture";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

//this is test for all lifts inside.
test.describe("All Lifts Inside", async () => {
  test("One after another lift", async ({ page }) => {
    await page.goto("https://main-brokenlifts.d.wheelmap.tech/stations");

    for (let i = 1; i < 8; i++) {
      await expect(
        page.getByRole("link", { name: i.toString() }).first(),
      ).toBeVisible();
      await page.getByRole("link", { name: i.toString() }).first().click();
      await page
        .getByRole("button", { name: "Lage auf der Umgebungskarte" })
        .click();
      await page
        .getByRole("button", { name: "Umgebungskarte", exact: true })
        .click();

      await page.waitForTimeout(2000);

      await page.getByRole("button", { name: "Karte schließen" }).click();
      await page.getByRole("link", { name: "Zur Startseite" }).click();
    }

    // Test for all lifts inside the stations
    // instead of using the the station number for nth(iii), I count until a 2 or 3.  ,
    // then I increase nth(iii)
    // it seems that I have to count nth(2) and nth(3) and nth(4) to get Hauptbahnhof ????
    // there seems to be better locator('li:nth-child(8) > .elevator-list > li > .tooltip-wrapped').first()
    // for line 8 , but I will use the current method for now, as it is more readable and easier to understand
    // also, there is sometimes the locator not found
    // 45 is therefore a rough guess for number of several stations

    for (let iii = 1; iii < 45; iii++) {
      for (let ii = 1; ii < 17; ii++) {
        const liftLink = page
          .getByRole("link", { name: ii.toString() })
          .nth(iii);
        if (!(await liftLink.isVisible())) {
          break;
        }

        await liftLink.click();
        await page
          .getByRole("button", { name: "Lage auf der Umgebungskarte" })
          .click();
        await page
          .getByRole("button", { name: "Umgebungskarte", exact: true })
          .click();

        //await page.waitForTimeout(2000);

        await page.getByRole("button", { name: "Karte schließen" }).click();
        await page.getByRole("link", { name: "Zur Startseite" }).click();
      }
    }
  });
});
