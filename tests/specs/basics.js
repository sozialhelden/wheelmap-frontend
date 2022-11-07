const acceptLocationAlertOnMobilesIfPresent = require('../lib/acceptLocationAlertOnMobilesIfPresent');

const saveScreenshot = require('../lib/saveScreenshot');

// See the WebDriver API documentation for a list of possible actions.
// https://webdriver.io/docs/api.html
// https://github.com/webdriverio/expect-webdriverio/blob/HEAD/docs/API.md

// See the Mocha API for test structure: https://mochajs.org/

describe('Wheelmap main page', function() {
  it('has a title', async function() {
    await browser.url('/');
    const title = await browser.getTitle();
    await expect(title).toMatch(/Wheelmap – Find wheelchair accessible places./i);
  });
});
