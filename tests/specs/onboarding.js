const saveScreenshot = require('../lib/saveScreenshot');

// See the WebDriver API documentation for a list of possible actions.
// https://webdriver.io/docs/api.html
// https://github.com/webdriverio/expect-webdriverio/blob/HEAD/docs/API.md

// See the Mocha API for test structure: https://mochajs.org/

describe('Onboarding dialog', function() {
  it('has a claim', async function() {
    await browser.url('/');
    const $dialog = await browser.$('section.modal-dialog');
    const $claim = await $dialog.$('.claim');
    expect($claim).toBeVisible();
    const claim = await $claim.getText();
    expect(claim).toMatch(/wheelchair accessible/i);
    expect(claim).toMatch(/free/i);
    expect(claim).toMatch(/traffic light system/i);
  });

  it('has a logo', async function() {
    await browser.url('/');
    const $dialog = await browser.$('section.modal-dialog');
    const $logo = await $dialog.$('img.logo');
    expect($logo).toBeVisible();
    // Check that the image actually has a src URL
    // expect((await $logo.getAttribute('src')).length).toBeGreaterThan(0);
  });

  it('closes by clicking start button', async function() {
    await browser.url('/');
    const $dialog = await browser.$('section.modal-dialog');
    expect($dialog).toBeVisible();
    await saveScreenshot('Onboarding dialog');
    const $button = await browser.$('button=Okay, let’s go!');
    await $button.click();
    expect($dialog).not.toBeVisible();
    await saveScreenshot('After closing the onboarding');
  });
});
