
import { test, expect } from '@playwright/test';
import { skipOnboarding } from './skipOnboarding';
import getBaseURL from './lib/base-url';
import AddWheelchairDescription from '~/components/CombinedFeaturePanel/components/AccessibilitySection/AddWheelchairDescription';
const baseURL = getBaseURL();

test('has base URL', async ({ page }) => {
  await page.goto(baseURL);
 
});

test('Add a new place', async ({ page }) => {
  try {
    await page.goto(baseURL);
 //   await skipOnboarding(page);
    await page.getByRole('link', { name: 'Add a new place' }).click();
    await page.waitForLoadState();
    await page.goto('https://wheelmap.pro/organizations/LPb4y2ri7b6fLxLFa/survey-projects/wx4mM8xFiQAsB5aLi/show?step=data.osm_place');
    await page.waitForLoadState();
    // Wait for the element to appear before asserting visibility
    const element = await page.waitForSelector('text=Is the new place already', { timeout: 30000 });
    expect(await element.isVisible()).toBeTruthy();
    // Check if the element is visible
    await page.locator('.css-w8vkur').isVisible().valueOf(); 
  } catch (error) {
    console.error('Test failed with error:', error.message);
    console.error(error.stack);
    throw error;
  }
});

test('Base data', async ({ page }) => {
  try {
    await page.goto('https://wheelmap.pro/organizations/LPb4y2ri7b6fLxLFa/survey-projects/wx4mM8xFiQAsB5aLi/show?step=data.osm_place');
    await page.waitForLoadState();
    await page.getByText('Is the new place already').click();
    await page.waitForLoadState();
    await page.getByRole('combobox').fill('Großer Stern');
    await page.waitForLoadState();
    await page.getByLabel('Continue').click();
    await page.waitForLoadState();
    await page.getByText('Name of the new place').click();
    await page.getByText('Street Name').click();
    await page.getByLabel('Continue').click();
    await page.waitForLoadState();
    await page.getByText('Please move the map to the').click();
    await page.getByPlaceholder('Search').fill('Großer Stern');
    await page.locator('a', { hasText: 'Großer Stern, 10785 Berlin, Germany' }).click();
    await page.getByLabel('Continue').click();
    await page.waitForLoadState();
    await page.getByText('Street Name').click();
    await page.getByLabel('Street Name').fill('Großer Stern');
    await page.getByLabel('Continue').click();
    await page.waitForLoadState();


  } catch (error) {
    console.error('Test failed with error:', error.message);
    console.error(error.stack);
    throw error;
  }
});  


test('Take a picture ', async ({ page }) => {
  try {
    await page.goto('https://wheelmap.pro/organizations/LPb4y2ri7b6fLxLFa/survey-projects/wx4mM8xFiQAsB5aLi/show?step=data.group_entering.entrance_photo');
    await page.waitForLoadState();
    await page.getByText('Please take a picture').click();
    await page.waitForLoadState();
    await page.getByLabel('Choose File').setInputFiles('./e2e/1000015934.jpg');
    await page.getByText('Please describe what is on').click();
    await page.getByLabel('Please describe what is on').fill('A picture of the entrance');
    await page.waitForLoadState();
    await page.getByLabel('Continue').click();
    await page.waitForLoadState();
    await page.getByText('Where is the main entrance').click();
    await page.getByPlaceholder('Search').click();
    await page.getByLabel('Continue').click();
    await page.waitForLoadState();

  } catch (error) {
    console.error('Test failed with error:', error.message);
    console.error(error.stack);
    throw error;
  }
});  

test('Getting in ', async ({ page }) => {
  try {
    await page.goto('https://wheelmap.pro/organizations/LPb4y2ri7b6fLxLFa/survey-projects/wx4mM8xFiQAsB5aLi/show?step=data.group_entering.entrance_has_steps');
    await page.waitForLoadState();
    await page.getByText('Are there steps at the entrance').click();
    await page.waitForLoadState();
    await page.getByText('No').click();
    await page.getByLabel('Continue').click();
    await page.waitForLoadState();
  } catch (error) {
    console.error('Test failed with error:', error.message);
    console.error(error.stack);
    throw error;
  }
}); 

test('Accessibility summary', async ({ page }) => {
  try {
    await page.goto('https://wheelmap.pro/organizations/LPb4y2ri7b6fLxLFa/survey-projects/wx4mM8xFiQAsB5aLi/show?step=data.group_entering.wheelchair_a11y');
    await page.waitForLoadState();
    await page.getByText('In summary: How wheelchair accessible').click();
    await page.getByRole('button', { name: 'partially'}).click();
    await page.waitForLoadState();
    await page.getByLabel('Continue').click();
    await page.waitForLoadState();
  } catch (error) {
    console.error('Test failed with error:', error.message);
    console.error(error.stack);
    throw error;
  }
});

test('WC', async ({ page }) => {
  try {
    await page.goto('https://wheelmap.pro/organizations/LPb4y2ri7b6fLxLFa/survey-projects/wx4mM8xFiQAsB5aLi/show?step=data.has_toilet');
    await page.waitForLoadState();
    await page.getByText('Is there a WC that is part of').click();
    await page.getByRole('button', { name: 'yes' }).click();
    await page.waitForLoadState();    
    //await page.getByLabel('Continue').click();
    //await page.waitForLoadState();
    await page.getByText('WC room').click();
    await page.getByText('Is the restroom signposted').click();
    await page.getByRole('button', { name: '👎 no' }).click();
    await page.waitForLoadState();
   // await page.getByLabel('Continue').click();
   // await page.waitForLoadState();
    await page.getByText('WC room').click();
    await page.getByText('Please describe the toilet').click();
    await page.locator('label', { hasText: 'The restroom door is at least' }).click();
    await page.waitForLoadState();
    await page.getByLabel('Continue').click();
    await page.waitForLoadState();
    await page.getByText('WC room').click();
    //left grab bars
    await page.getByText('Does the toilet have grab bars').click();
    await page.getByRole('button', { name: 'yes' }).click();
    await page.waitForLoadState();
   // await page.getByLabel('Continue').click();
   // await page.waitForLoadState();
    await page.getByText('WC room').click();
    //right grab bars
    await page.getByText('Does the toilet have grab bars').click();
    await page.getByRole('button', { name: 'no' }).click();
    await page.waitForLoadState();
   // await page.getByLabel('Continue').click();
   // await page.waitForLoadState();
    await page.getByText('WC room').click();
    await page.getByText('How high is the toilet base').click();
    await page.waitForLoadState();
    await page.getByLabel('Continue').click();
    await page.waitForLoadState();
    await page.getByText('WC room').click();
    await page.getByText('In summary: How wheelchair ').click();
    await page.getByRole('button', { name: 'not at all' }).click();
    await page.waitForLoadState();
   // await page.getByLabel('Continue').click();
  //  await page.waitForLoadState();
    await page.getByText('WC room').click();
    await page.getByText('Can you describe why this WC').click();
    await page.getByLabel('Can you describe why this WC').fill('The maximal side is 100 cm wide');
    await page.waitForLoadState();
    await page.getByLabel('Continue').click();
    await page.waitForLoadState();
    await page.getByText('WC room').click();
    await page.getByText('Is the WC usage for free (').click();
    await page.getByRole('button', { name: 'only for customers' }).click();
    await page.waitForLoadState();
    await page.locator('input[type=file]').setInputFiles('./e2e/10000200152.jpg');
    await page.getByText('Please describe what is on').click();
    await page.getByLabel('Please describe what is on').fill('A picture of the WC');
  } catch (error) {


    console.error('Test failed with error:', error.message);
    console.error(error.stack);
    throw error;
  }
});


// Removed unused custom locator function
