const acceptLocationAlertOnMobilesIfPresent = require('../lib/acceptLocationAlertOnMobilesIfPresent');
const getCurrentUrl = require('../lib/getCurrentUrl');
const saveScreenshot = require('../lib/saveScreenshot');

// See the WebDriver API documentation for a list of possible actions.
// https://webdriver.io/docs/api.html
// https://github.com/webdriverio/expect-webdriverio/blob/HEAD/docs/API.md

// The accessibility.cloud place info tvZdmZMaNP5CvbQbp ('Barlachblick', Ratzeburg)
// references OSM node 1743391754 via its `sameAs` property. OSM URLs are canonical
// for such places, so both their /nodes/<place info id> URL and their search result
// have to end up on /node/1743391754.
describe('Canonical place URLs', function() {
  it('redirects accessibility.cloud place URLs to the sameAs-referenced OSM URL', async function() {
    await browser.url('/nodes/tvZdmZMaNP5CvbQbp');

    const $okayButton = await $('button=Okay, let’s go!');
    if (await $okayButton.isExisting()) {
      await $okayButton.click();
    }

    await browser.waitUntil(
      async () => (await getCurrentUrl()).match(/\/node\/1743391754\/?(\?.*)?$/),
      {
        timeoutMsg: 'Expected /nodes/tvZdmZMaNP5CvbQbp to redirect to the canonical OSM URL /node/1743391754',
      }
    );

    await saveScreenshot('Redirected to canonical OSM place URL');

    const $placeName = await $('h1*=Barlachblick');
    await $placeName.waitForExist();
  });

  it('opens the canonical OSM URL when clicking a matching search result', async function() {
    await browser.url('/');

    await acceptLocationAlertOnMobilesIfPresent();

    const $okayButton = await $('button=Okay, let’s go!');
    if (await $okayButton.isExisting()) {
      await $okayButton.click();
    }

    const $search = await $('[name="search"]');
    await $search.click();
    await $search.addValue('Barlachblick');

    const $results = await $('.search-results');
    await $results.waitForExist();
    await saveScreenshot('Barlachblick search results are loading');

    // Wait for the accessibility (wheelmap) data to be loaded before clicking.
    const $result = await $results.$('header=Barlachblick');
    await browser.waitUntil(
      async () => await (await $results.$('header.is-on-wheelmap=Barlachblick')).isExisting(),
      {
        timeoutMsg: 'Expected the Barlachblick search result to load its accessibility data',
      }
    );
    await saveScreenshot('Barlachblick search result is ready');

    await $result.waitForClickable();
    await $result.click();

    await browser.waitUntil(
      async () => (await getCurrentUrl()).match(/\/node\/1743391754\/?(\?.*)?$/),
      {
        timeoutMsg: 'Expected the clicked search result to open the canonical OSM URL /node/1743391754',
      }
    );

    await saveScreenshot('Search result opened the canonical OSM place URL');

    const $placeName = await $('h1*=Barlachblick');
    await $placeName.waitForExist();
  });
});
