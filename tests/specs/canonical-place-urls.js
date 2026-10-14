const getCurrentUrl = require('../lib/getCurrentUrl');
const saveScreenshot = require('../lib/saveScreenshot');

// See the WebDriver API documentation for a list of possible actions.
// https://webdriver.io/docs/api.html
// https://github.com/webdriverio/expect-webdriverio/blob/HEAD/docs/API.md

// The accessibility.cloud PlaceInfo tvZdmZMaNP5CvbQbp ('Barlachblick', Ratzeburg)
// links OSM node 1743391754 via its `sameAs` property.
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
});
