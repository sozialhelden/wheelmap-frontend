const acceptLocationAlertOnMobilesIfPresent = require('../lib/acceptLocationAlertOnMobilesIfPresent');
const saveScreenshot = require('../lib/saveScreenshot');

// See the WebDriver API documentation for a list of possible actions.
// https://webdriver.io/docs/api.html
// https://github.com/webdriverio/expect-webdriverio/blob/HEAD/docs/API.md

// See the Mocha API for test structure: https://mochajs.org/
const IdPropertyName = 'element-6066-11e4-a52e-4f735466cecf';

describe('Highlighted marker', function() {
  it('is shown on deeplinks', async function() {
    await browser.url('/node/30217208');
    await acceptLocationAlertOnMobilesIfPresent();

    const $button = await $('button=Okay, let’s go!');
    await $button.click();

    const $placeInfoPanel = await $('.toolbar[aria-label="Berlin Alexanderplatz"]');
    const $placeName = await $placeInfoPanel.$('h1=Berlin Alexanderplatz');
    await expect($placeName).toBeDisplayedInViewport();
    await saveScreenshot('After opening');

    const $highlightedMarker = await $('a.highlighted-marker[aria-label="Berlin Alexanderplatz Fully wheelchair accessible"]');
    await expect($highlightedMarker).toBeDisplayedInViewport();
    await saveScreenshot('Marker visible');
  });

  // it('has a logo', async function() {
  //   await browser.url('/');
  //   await acceptLocationAlertOnMobilesIfPresent();
  //   const $dialog = await browser.$('section.modal-dialog');
  //   const $logo = await $dialog.$('.logo');
  //   await expect($logo).toBeDisplayedInViewport();
  //   await expect($logo).toHaveAttr('aria-label', 'Wheelmap');
  //   const $logoSVG = await $logo.$('svg');
  //   await expect($logoSVG).toBeDisplayedInViewport();
  // });

  // it('closes by clicking start button', async function() {
  //   await browser.url('/');
  //   await acceptLocationAlertOnMobilesIfPresent();
  //   const $dialog = await browser.$('section.modal-dialog');
  //   await expect($dialog).toBeDisplayedInViewport();
  //   await saveScreenshot('Onboarding dialog');
  //   const $button = await browser.$('button=Okay, let’s go!');
  //   await $button.click();
  //   await expect($dialog).not.toBeDisplayedInViewport();
  //   await saveScreenshot('After closing the onboarding');
  // });
});
