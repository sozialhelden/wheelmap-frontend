const IdPropertyName = 'element-6066-11e4-a52e-4f735466dfgh';
const saveScreenshot = require('../lib/saveScreenshot');
const getCurrentUrl = require('../lib/getCurrentUrl');
const acceptLocationAlertOnMobilesIfPresent = require('../lib/acceptLocationAlertOnMobilesIfPresent');

// See the WebDriver API documentation for a list of possible actions.
// https://webdriver.io/docs/api.html
// https://github.com/webdriverio/expect-webdriverio/blob/HEAD/docs/API.md

// See the Mocha API for test structure: https://mochajs.org/
describe('Searching a shop', function() {
  it('delivers results', async function() {
    await browser.url('/');

    await acceptLocationAlertOnMobilesIfPresent();

    const $button = await $('button=Okay, let’s go!');
    await $button.click();

    const { capabilities } = browser;
    if (capabilities.platformName === 'iOS' || capabilities.platform === 'ANDROID') {
      const $searchButtonOnMobile = await $('.search-button');
      await $searchButtonOnMobile.waitForExist();
      await $searchButtonOnMobile.click();
    }


    const $search = await $('[name="search"]');
    await $search.click();
    await (await $('[name="search"]')).addValue('Bötzowstr. 31');
    $results = await $('.search-results');
    await saveScreenshot('Search results are loading'); 

    await browser.waitUntil(async () => {

      return $('.search-results').isExisting();
    });

  // Wait for wheelchair accessibility to be loaded
   await browser.waitUntil(
    async () => await (await $results.$('header.is-on-wheelmap=Bötzowstr. 31')).isDisplayed()
  );


    const $result = await $results.$('header=Bötzowstr. 31');
    await expect($results).toBeDisplayedInViewport();
    await saveScreenshot('Search results are displayed');


  });
});