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
      const el = await browser.findElement('css selector', 'a[href="/search?category=food"]');
      return el && el[IdPropertyName];
    });
    await saveScreenshot('Category and accessibility filter is shown');
    await (await $('[name="search"]')).addValue('alexanderplatz');

    const $results = await $('.search-results');
    await expect($results).toBeDisplayedInViewport();
    await saveScreenshot('Search results are loading');

    const $result = await $results.$('header=Berlin Alexanderplatz');
    await saveScreenshot('Search results are displayed');

    // Wait for wheelchair accessibility to be loaded
    await browser.waitUntil(
      async () => await (await $results.$('header.is-on-wheelmap=Berlin Alexanderplatz')).isDisplayed()
    );

    await saveScreenshot('Search results show their accessibility');

    const $resultAfterSearch = await $results.$('header=Berlin Alexanderplatz');
    await $resultAfterSearch.waitForClickable();
    await $resultAfterSearch.click();

    await browser.waitUntil(async () => (await getCurrentUrl()).match(/\/node\//));
    const results = await browser.findElement('css selector', '.search-results');
    await expect(results[IdPropertyName]).toBeUndefined();
    const $placeInfoPanel = await $('.toolbar[aria-label~="Alexanderplatz"');
    const $placeName = await $placeInfoPanel.$('h1*=Alexanderplatz');
    await expect($placeName).toBeDisplayedInViewport();
    await saveScreenshot('After click on single search result');
  });
});
