import { test, expect, Page } from '@playwright/test';
import getBaseURL from './lib/base-url';

const baseURL = getBaseURL();

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

test('princinpal railway station of Berlin works with multi-language description', async ({ page }) => {
  await page.goto(baseURL);
  await dismissOnboarding(page);
  
  // Gehe zum Hauptbahnhof Berlin
  await page.goto(`${baseURL}/nodes/240109189`);
  await page.waitForLoadState('networkidle');
  
  // Überprüfe, dass die Beschreibung in mehreren Sprachen angezeigt wird
  const description = page.getByTestId('place-description');
  await expect(description).toBeVisible();
  
 // Optional: Logge die gesamte Beschreibung für Debugging-Zwecke
  const fullDescription = await description.textContent();
  console.log('Full description text:', fullDescription);

  // Optional: Überprüfe, dass die Beschreibung tatsächlich beide Sprachen enthält
  if (fullDescription) {
    const hasGerman = fullDescription.toLowerCase().includes('berliner hauptbahnhof');
    const hasEnglish = fullDescription.toLowerCase().includes('berlin central station');
    console.log('Contains German:', hasGerman);
    console.log('Contains English:', hasEnglish);
    
    expect(hasGerman).toBeTruthy();
    expect(hasEnglish).toBeTruthy();}
  
  });

  test('english description should be the first language displayed', async ({ page }) => {
    await page.goto(baseURL);
    await dismissOnboarding(page);

    // Gehe zum Hauptbahnhof Berlin
    await page.goto(`${baseURL}/nodes/240109189`);
    await page.waitForLoadState('networkidle');


    // Hole den Text und prüfe, dass die englische Beschreibung zuerst steht
    const description = page.getByTestId('place-description');
    await expect(description).toBeVisible();
    const fullDescription = await description.textContent();
    expect(fullDescription).toBeTruthy();

    // Die englische Beschreibung, wie im ersten Test
    const english = 'Berlin Central Station is the largest tower station in Europe and an important transport hub in Germany.';
    const german = 'Der Berliner Hauptbahnhof ist der größte Turmbahnhof Europas und ein wichtiger Verkehrsknotenpunkt in Deutschland.';

    // Prüfe, dass beide Texte vorkommen
    expect(fullDescription).toContain(english);
    expect(fullDescription).toContain(german);

    // Prüfe, dass die englische Beschreibung vor der deutschen steht
    const englishIndex = fullDescription!.indexOf(english);
    const germanIndex = fullDescription!.indexOf(german);
    expect(englishIndex).toBeGreaterThan(-1);
    expect(germanIndex).toBeGreaterThan(-1);
    expect(englishIndex).toBeLessThan(germanIndex);

   }); 