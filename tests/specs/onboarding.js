const acceptLocationAlertOnMobilesIfPresent = require('../lib/acceptLocationAlertOnMobilesIfPresent');
const saveScreenshot = require('../lib/saveScreenshot');

// See the WebDriver API documentation for a list of possible actions.
// https://webdriver.io/docs/api.html
// https://github.com/webdriverio/expect-webdriverio/blob/HEAD/docs/API.md

// See the Mocha API for test structure: https://mochajs.org/

describe('Onboarding dialog', function() {
  it('has a claim', async function() {
    await browser.url('/');
    await acceptLocationAlertOnMobilesIfPresent();
    const $dialog = await browser.$('section.modal-dialog');
    const $claim = await $dialog.$('.claim');
    await expect($claim).toBeDisplayedInViewport();
    const claim = await $claim.getText();
    await expect(claim).toMatch(/wheelchair accessible/i);
    await expect(claim).toMatch(/free/i);
    await expect(claim).toMatch(/traffic light system/i);
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
