import useSubmitNewValueCallback from '~/lib/fetchers/osm-api/makeChangeRequestToOsmApi';
import { test, expect } from './lib/axe-test';
import getBaseURL from './lib/base-url';
import { skipOnDesktops, skipOnMobiles } from './lib/device-type';
import { skipOnboarding } from './skipOnboarding';

const baseURL = getBaseURL();

test.beforeEach(async ({ page }) => {
  // Go to the starting url before each test.
  await page.goto(baseURL);
  //await skipOnboarding(page);
});

test('Goto Open on OpenStreetMap', async ({ page }) => {
  await page.goto('https://feature-a11ymap.wheelmap.tech/composite/ac:PlaceInfo:WcdW6a8tJumrqsswk,buildings:way:718035022');
  await page.waitForLoadState();
  //goto Open Street Map
  await page.goto('https://www.openstreetmap.org/#map=19/52.514553/13.350202');
  await page.waitForLoadState();
  skipOnMobiles();
  //goto Siegessäule
  await page.getByRole('textbox', { name: 'Search' }).fill('Siegessäule');
  await page.waitForLoadState();
  await expect(page).toHaveTitle("OpenStreetMap");
  await page.goto('https://www.openstreetmap.org/search?query=Siegessäule#map=19/52.514513/13.350111');
  await page.getByRole('button', { name: 'Go' }).click();
  await page.waitForLoadState();
  await expect(page.getByText('Victory Column')).toBeVisible();
});
 
//test('Goto Open on Bing Maps', async ({ page }) => {//
  test('Goto Open on Apple Maps', async ({ page }) => {
  await page.goto('https://feature-a11ymap.wheelmap.tech/composite/ac:PlaceInfo:WcdW6a8tJumrqsswk,buildings:way:718035022');
  await page.waitForLoadState();
  skipOnMobiles();
  //goto Siegessäule
  await page.goto('http://maps.apple.com/?ll=52.5145533,13.3502022&q=Gro%C3%9Fer%20Stern');
  await page.waitForLoadState();  
  await expect(page.getByRole('heading', { name: 'Großer Stern' })).toBeVisible();
  await expect(page.getByText('Victory Column')).toBeVisible();
});

test('EmbassyOfSwitzerland-MyOwnAdress', async ({ page }) => {
  await page.goto('https://feature-a11ymap.wheelmap.tech/composite/amenities:relation:2886766,buildings:relation:2886766');
  await page.waitForLoadState();
  await expect(page.getByText('Otto-von-Bismarck-Allee')).toBeVisible();
 // await page.goto('http://maps.apple.com/?ll=13.371418,52.521004,13.371544,52.521004,13.371544,52.521065,13.371418,52.521065,13.371418,52.521004,13.3709,52.520999,13.370902,52.521152,13.370913,52.521152,13.370928,52.521151,13.370971,52.521151,13.370972,52.521153,13.370973,52.521155,13.370974,52.521158,13.370976,52.52116,13.370978,52.521162,13.370983,52.521164,13.370987,52.521166,13.370992,52.521167,13.370999,52.521168,13.371006,52.521168,13.371012,52.521167,13.371018,52.521166,13.371022,52.521164,13.371025,52.521161,13.371409,52.52116,13.371408,52.521205,13.371527,52.521203,13.371646,52.521202,13.371662,52.521202,13.371659,52.520999,13.3709,52.520999&q=Embassy%20of%20Switzerland');
  await page.waitForLoadState();  
  await expect(page.getByRole('heading', { name: 'Embassy of Switzerland' })).toBeVisible();
});

test('EmbassyOfSwitzerland-OnTheWeb', async ({ page }) => {
  await page.goto('https://feature-a11ymap.wheelmap.tech/composite/amenities:relation:2886766,buildings:relation:2886766');
  await page.waitForLoadState();
  await expect(page.getByText('https://www.eda.admin.ch/berlin.html')).toBeVisible();
  await page.goto('http://www.eda.admin.ch/berlin.html');
  await page.waitForLoadState();  
  await expect(page.locator('text=Schweiz und Deutschland').first()).toBeVisible();
});

test('EmbassyOfSwitzerland-CallMyPhoneNumber', async ({ page }) => {

  await page.goto('https://feature-a11ymap.wheelmap.tech/composite/amenities:relation:2886766,buildings:relation:2886766');
  await page.waitForLoadState();
  await expect(page.getByText('Call +49 30 390 40 00')).toBeVisible();
  await page.waitForLoadState();
  await page.locator('text=Call +49 30 390 40 00').first().click(); 
  await page.waitForLoadState(); 
});