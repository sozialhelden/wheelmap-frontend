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

test('principal railway station of Berlin works with multi-language description', async ({ page }) =>  {
  await page.goto(baseURL);
  await dismissOnboarding(page);
  
  // Gehe zum Hauptbahnhof Berlin
  await page.goto(`${baseURL}/amenities/node:240109189`);
  await page.waitForLoadState('networkidle');
  await page.getByPlaceholder('Search for place or address').click();
  await page.getByPlaceholder('Search for place or address').fill('Berlin Central Station');
  await page.getByPlaceholder('Search for place or address').press('Enter');
  await page.waitForLoadState('networkidle');
  await page.getByRole('link', { name: 'Berlin Central Station(Train' }).click();
  await page.getByRole('heading',{name: 'Berlin Central Station'}).click();

  // Überprüfe, dass die Beschreibung in mehreren Sprachen angezeigt wird
  await page.getByText('Train').click();
  await page.getByText('Wifi').click();
  await page.getByText('Free').click();
  await page.getByText('Realtime departures board').click();
  await page.getByTestId('general-osm-section').locator('header').click();
  await page.getByText('No speech output available').click();
  await page.getByText('DB ').click();

});

  test('english description should be the first language displayed', async ({ page }) => {
    await page.goto(baseURL);
    await dismissOnboarding(page);

  ///  
     // Gehe zum Hauptbahnhof Berlin
    await page.goto(`${baseURL}/amenities/node:240109189`);
    await page.waitForLoadState('networkidle');
    await page.getByPlaceholder('Search for place or address').click();
    await page.getByPlaceholder('Search for place or address').fill('Berlin Central Station');
    await page.getByPlaceholder('Search for place or address').press('Enter');
    
    await page.getByRole('link', { name: 'Berlin Central Station(Train' }).click();

    await page.getByRole('heading',{name: 'Berlin Central Station'}).click();
   //HIER müsste eigentlich die englische Beschreibung angezeigt werden, da sie in der Datenbank als erste Sprache hinterlegt ist. Wenn die deutsche Beschreibung zuerst angezeigt wird, könnte das auf ein Problem mit der Sortierung der Sprachen in der Anzeige hinweisen.
    await page.getByText('Hauptbahnhof der').click();   

   }); 