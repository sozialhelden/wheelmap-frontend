const IdPropertyName = 'element-6066-11e4-a52e-4f735466cecf';
const saveScreenshot = require('../lib/saveScreenshot');
const getCurrentUrl = require('../lib/getCurrentUrl');
const acceptLocationAlertOnMobilesIfPresent = require('../lib/acceptLocationAlertOnMobilesIfPresent');

// See the WebDriver API documentation for a list of possible actions.
// https://webdriver.io/docs/api.html
// https://github.com/webdriverio/expect-webdriverio/blob/HEAD/docs/API.md

// See the Mocha API for test structure: https://mochajs.org/

describe('Searching a place by name', function() {
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
    await browser.waitUntil(async () => {
      const el = await browser.findElement('css selector', '[class^="CategoryMenu"]');
      return el && el[IdPropertyName];
    });
    await saveScreenshot('Category and accessibility filter is shown');
    await (await $('[name="search"]')).addValue('alexanderplatz');

    const $results = await $('.search-results');
    expect($results).toBeVisible();
    await saveScreenshot('Search results are loading');

    // TODO: This should not be a <h1>, but a <header>.
    const $result = await $results.$('h1=S Alexanderplatz');
    await saveScreenshot('Search results are displayed');

    // Wait for wheelchair accessibility to be loaded
    // The icon should a circle in Wheelmap's brand color green
    await browser.waitUntil(
      async () => await (await $result.$('circle[fill="#7ec512"]')).isDisplayed()
    );

    await saveScreenshot('Search results show their accessibility');

    await $result.click();
    const results = await browser.findElement('css selector', '.search-results');
    expect(results[IdPropertyName]).toBeUndefined();

    await browser.waitUntil(
      async () => (await getCurrentUrl()) === 'https://wheelmap.org/nodes/3908141014'
    );
    const $placeInfoPanel = await $('.toolbar[aria-label="S Alexanderplatz"');
    const $placeName = await $placeInfoPanel.$('h1=S Alexanderplatz');
    expect($placeName).toBeVisibleInViewport();
    await saveScreenshot('After click on single search result');
  });
});
