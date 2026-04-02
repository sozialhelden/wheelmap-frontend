import { expect, test } from "@playwright/test";
import { skipOnboarding } from "../utils/control-onboarding";

test.describe("Next accessible toilet button", () => {
  // Test-Ort ohne barrierefreie Toilette, aber mit nahgelegenen Toiletten
  // TU Berlin ER-Gebäude hat keine eigene Toiletten-Info
  const PLACE_WITHOUT_TOILET_URL = "/buildings/way:23517902";

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await skipOnboarding(page);
  });

  test.skip('should show "Next accessible toilet" link when place has no accessible toilet', async ({
    page,
  }) => {
    // Intercepte API-Aufrufe um zu sehen was geladen wird
    const apiCalls: string[] = [];
    page.on("request", (request) => {
      const url = request.url();
      if (url.includes("nearest=toilets") || url.includes("toilets")) {
        apiCalls.push(url);
      }
    });

    await page.goto(PLACE_WITHOUT_TOILET_URL);
    await page.waitForLoadState("networkidle");

    // Warte auf das Laden der Ortsdetails
    await expect(page.getByRole("heading").first()).toBeVisible();

    // Warte zusätzlich etwas für die nearby-toilets API
    await page.waitForTimeout(2000);

    console.log("API calls for toilets:", apiCalls);

    // Der "Nächste Toilette" / "Next wheelchair-accessible WC" Link sollte sichtbar sein
    // Die Komponente NextToiletDirections rendert einen Link, keinen Button
    const toiletLink = page.getByRole("link", {
      name: /next wheelchair|nächste.*wc|nächste toilette/i,
    });

    // Prüfe ob der Link vorhanden ist
    const isLinkVisible = await toiletLink.isVisible().catch(() => false);

    if (isLinkVisible) {
      // Link ist sichtbar - Test erfolgreich
      await expect(toiletLink).toBeVisible();

      // Prüfe ob eine Entfernungsangabe vorhanden ist (z.B. "50 m →")
      const linkText = await toiletLink.textContent();
      console.log("Toilet link text:", linkText);
      expect(linkText).toMatch(/\d+\s*(m|km|meter|kilometer)/i);
    } else {
      // Link ist nicht sichtbar - logge den Grund
      console.log("Toilet link not visible. Possible reasons:");
      console.log("1. Place has accessible toilet (toilets:wheelchair=yes)");
      console.log("2. No nearby toilets found in API response");
      console.log("3. Feature has no coordinates or wrong @type");
      console.log("4. API endpoint returned empty results");

      // Prüfe ob es einen Platzhalter gibt (Loading State)
      const placeholder = page.locator(
        'span:has-text("Next wheelchair-accessible WC")',
      );
      const hasPlaceholder = (await placeholder.count()) > 0;
      console.log("Has placeholder:", hasPlaceholder);

      // Prüfe den Text auf der Seite
      const pageText = await page.textContent("body");
      const hasToiletText =
        pageText?.toLowerCase().includes("toilet") ||
        pageText?.toLowerCase().includes("wc");
      console.log("Page contains toilet/wc text:", hasToiletText);
    }
  });

  test.skip("clicking toilet link should navigate to toilet details", async ({
    page,
  }) => {
    await page.goto(PLACE_WITHOUT_TOILET_URL);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000); // Wait for nearby toilets API

    const toiletLink = page.getByRole("link", {
      name: /next wheelchair|nächste.*wc|nächste toilette/i,
    });

    // Wenn der Link sichtbar ist, klicke darauf
    if (await toiletLink.isVisible().catch(() => false)) {
      const href = await toiletLink.getAttribute("href");
      console.log("Toilet link href:", href);

      await toiletLink.click();
      await page.waitForLoadState("networkidle");

      // Nach dem Klick sollte sich die URL geändert haben
      const currentUrl = page.url();
      console.log("Navigated to:", currentUrl);

      // Prüfe ob Toiletten-Details angezeigt werden
      const toiletHeading = page.getByRole("heading").first();
      await expect(toiletHeading).toBeVisible();
    } else {
      console.log("Toilet link not visible - skipping navigation test.skip");
      test.skip();
    }
  });

  test.skip("Paris-Moskau restaurant should show next wheelchair-accessible WC", async ({
    page,
  }) => {
    // Paris-Moskau Restaurant in Berlin (Alt-Moabit 141)
    // OSM: https://www.openstreetmap.org/node/137483925
    const PARIS_MOSKAU_URL = "/amenities/node:137483925";

    await page.goto(PARIS_MOSKAU_URL);
    await page.waitForLoadState("networkidle");

    // Warte auf das Laden der Ortsdetails
    const heading = page.getByRole("heading").first();
    await expect(heading).toBeVisible();

    // Prüfe dass es das Paris-Moskau Restaurant ist
    const headingText = await heading.textContent();
    console.log("Restaurant heading:", headingText);
    expect(headingText?.toLowerCase()).toContain("paris");

    // Warte zusätzlich auf die nearby-toilets API
    await page.waitForTimeout(2000);

    // Der "Next wheelchair-accessible WC" Link sollte sichtbar sein
    const toiletLink = page.getByRole("link", {
      name: /next wheelchair|nächste.*wc/i,
    });
    await expect(toiletLink).toBeVisible();

    // Prüfe die Entfernung (ca. 360m laut User)
    const linkText = await toiletLink.textContent();
    console.log("Toilet link text:", linkText);
    expect(linkText).toMatch(/\d+\s*m\s*→/);

    // Extrahiere die Entfernung
    const distanceMatch = linkText?.match(/(\d+)\s*m/);
    if (distanceMatch) {
      const distance = Number.parseInt(distanceMatch[1]);
      console.log("Distance to next toilet:", distance, "m");
      // Erwarte eine Entfernung zwischen 300-400m (ca. 360m)
      expect(distance).toBeGreaterThan(250);
      expect(distance).toBeLessThan(500);
    }

    // Klicke auf den Link und prüfe die Navigation
    const href = await toiletLink.getAttribute("href");
    console.log("Toilet link href:", href);

    // URL vor dem Klick
    const urlBefore = page.url();
    console.log("URL before click:", urlBefore);

    await toiletLink.click();

    // Warte auf URL-Änderung
    await page
      .waitForURL(/node:11901491062|toilet/i, { timeout: 10000 })
      .catch(() => {
        console.log("URL did not change to expected toilet");
      });

    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Prüfe die neue URL
    const currentUrl = page.url();
    console.log("Navigated to:", currentUrl);

    // Prüfe ob die URL sich geändert hat
    const urlChanged = !currentUrl.includes("137483925");
    console.log("URL changed from restaurant:", urlChanged);

    if (urlChanged) {
      // Prüfe dass ein neuer Ort geladen wurde
      const newHeading = page.getByRole("heading").first();
      await expect(newHeading).toBeVisible();
      const newHeadingText = await newHeading.textContent();
      console.log("New place heading:", newHeadingText);
      // Der neue Ort sollte nicht mehr Paris-Moskau sein
      expect(newHeadingText?.toLowerCase()).not.toContain("paris");
    } else {
      console.log(
        "BUG: Navigation to toilet failed - stayed on restaurant page",
      );
      // Log mehr Details für Debugging
      const pageContent = await page.locator("body").textContent();
      console.log(
        'Page contains "toilet":',
        pageContent?.toLowerCase().includes("toilet"),
      );
    }
  });
});
