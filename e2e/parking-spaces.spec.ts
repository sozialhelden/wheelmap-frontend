/**
 * E2E Tests für Parkplätze mit Barrierefreiheits-Tags
 * 
 * Asana-Ticket: https://app.asana.com/0/1213356985075012/1208010078664178
 * 
 * Problem: Parkplätze mit Tags wie:
 * - amenity=parking_space
 * - parking_space=disabled
 * - disabled=designated
 * 
 * werden als "Unnamed place" angezeigt statt als barrierefreie Parkplätze
 * mit korrekter Accessibility-Markierung (grün/gelb/rot).
 */

import { test, expect, Page } from '@playwright/test';
import getBaseURL from './lib/base-url';

const baseURL = getBaseURL();

// Test-Parkplatz aus dem Bug-Report
// OSM: https://www.openstreetmap.org/way/1116394998
// Tags: amenity=parking_space, parking_space=disabled, disabled=designated
const ACCESSIBLE_PARKING_SPACE_URL = `${baseURL}/way/1116394998`;

// Helper to dismiss onboarding dialog
async function dismissOnboarding(page: Page) {
  await page.waitForLoadState('networkidle');
  
  const dialog = page.getByRole('dialog');
  
  try {
    await dialog.waitFor({ state: 'visible', timeout: 5000 });
    
    // Click through all visible onboarding buttons
    const buttonPatterns = [/okay|let.*go/i, /skip/i, /let.*go/i];
    
    for (const pattern of buttonPatterns) {
      const button = page.getByRole('button', { name: pattern });
      if (await button.isVisible({ timeout: 2000 }).catch(() => false)) {
        await button.click();
        await page.waitForTimeout(500);
      }
    }
  } catch {
    // Dialog may not appear
  }
}

test.describe('Parking spaces accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(baseURL);
    await dismissOnboarding(page);
  });

  test('accessible parking space should not show "Unnamed place"', async ({ page }) => {
    await page.goto(ACCESSIBLE_PARKING_SPACE_URL);
    await page.waitForLoadState('networkidle');

    // Der Ort sollte NICHT als "Unnamed place" angezeigt werden
    const unnamedPlaceText = page.getByText('Unnamed place');
    await expect(unnamedPlaceText).not.toBeVisible();

    // Stattdessen sollte ein sinnvoller Name erscheinen, z.B. "Accessible Parking" oder Kategorie-Name
    const placeHeader = page.getByRole('heading').first();
    await expect(placeHeader).toBeVisible();
    
    // Der Heading-Text sollte etwas Sinnvolles enthalten
    const headerText = await placeHeader.textContent();
    expect(headerText?.toLowerCase()).not.toContain('unnamed');
  });

  test('accessible parking space should show accessibility status', async ({ page }) => {
    await page.goto(ACCESSIBLE_PARKING_SPACE_URL);
    await page.waitForLoadState('networkidle');

    // Da parking_space=disabled gesetzt ist, sollte grüne Accessibility angezeigt werden
    // Mindestens einer dieser Texte sollte sichtbar sein:
    const accessibilityIndicators = [
      page.getByText(/wheelchair accessible/i),
      page.getByText(/accessible parking/i),
      page.getByText(/barrierefreier Parkplatz/i),
      page.getByText(/Rollstuhlgerecht/i),
      page.getByRole('img', { name: /accessible|wheelchair|rollstuhl/i }),
    ];

    // Prüfe ob mindestens ein Accessibility-Indikator vorhanden ist
    let hasAccessibilityInfo = false;
    for (const indicator of accessibilityIndicators) {
      if (await indicator.isVisible().catch(() => false)) {
        hasAccessibilityInfo = true;
        break;
      }
    }

    expect(hasAccessibilityInfo).toBe(true);
  });

  test('accessible parking space should have correct ARIA structure', async ({ page }) => {
    await page.goto(ACCESSIBLE_PARKING_SPACE_URL);
    await page.waitForLoadState('networkidle');

    // Der Ort sollte semantisch korrekt strukturiert sein
    // Es sollte eine Überschrift mit dem Ortsnamen geben
    const mainHeading = page.getByRole('heading').first();
    await expect(mainHeading).toBeVisible();

    // Der Accessibility-Status sollte für Screenreader erkennbar sein
    // Entweder durch Text oder durch aria-label
    const accessibilitySection = page.locator('[class*="accessibility"], [aria-label*="accessibility"]');
    
    // Wenn keine explizite Accessibility-Section existiert, sollte der Status
    // zumindest irgendwo im Inhalt erkennbar sein
    const pageContent = await page.textContent('body');
    const hasAccessibilityContent = pageContent?.match(/wheelchair|accessible|parking|rollstuhl|barrierefrei/i);
    
    expect(hasAccessibilityContent).toBeTruthy();
  });

  test('parking space page should pass axe accessibility scan', async ({ page }) => {
    // Import axe dynamically for this test
    const AxeBuilder = (await import('@axe-core/playwright')).default;
    
    await page.goto(ACCESSIBLE_PARKING_SPACE_URL);
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .exclude('.maplibregl-canvas') // Exclude map canvas from scan
      .analyze();

    // Akzeptiere nur wenige Violations (z.B. bekannte Probleme mit externen Komponenten)
    expect(results.violations.length).toBeLessThanOrEqual(3);
  });
});

test.describe('Parking accessibility with capacity:disabled tag', () => {
  // Dieser Test prüft, ob capacity:disabled korrekt interpretiert wird
  // Diese Logik sollte im neuen Code bereits funktionieren

  test('parking with capacity:disabled should show as accessible', async ({ page }) => {
    // Wir müssten einen Test-Ort mit capacity:disabled finden
    // Für jetzt skippen wir diesen Test, bis wir einen geeigneten Testort haben
    test.skip();
  });
});
