// var assert = require('assert');
// var expect = require('expect');

const locale = browser.desiredCapabilities.locale;

// TODO: Use translations for this
const selectors = {
  en_US: {
    homeButton: '~Home',
    startButton: '~Okay, let’s go!',
    placeMarker: '~Bunte SchokoWelt Fully wheelchair accessible',
    editButton: '~Fully wheelchair accessible Entrance has no steps, and all rooms are accessible without steps.',
    expandButton: '~Expand panel',
    partiallyOption: '~Partially',
    cancelButton: '~Cancel',
    addImagesButton: '~Add images',
    searchButton: '~Search',
    searchInput: '~Search for place or address',
    shoppingButton: '~Shopping',
    atLeastPartiallyWheelchairAccessibleButton: '~At least partially wheelchair accessible',
    goButton: '~Go!',
    showMeWhereIAmButton: '~Show me where I am',
  },
  de_DE: {
    homeButton: '~Start',
    startButton: '~Okay, los geht’s!',
    placeMarker: '~Bunte SchokoWelt Voll rollstuhlgerecht',
    editButton: '~Voll rollstuhlgerecht Eingang hat keine Stufen und alle Räume sind ohne Stufen zugänglich.',
    expandButton: '~Expand panel',
    partiallyOption: '~Teilweise',
    cancelButton: '~Abbrechen',
    addImagesButton: '~Bilder hinzufügen',
    searchButton: '~Suchen',
    searchInput: '~Such nach Ort oder Adresse',
    shoppingButton: '~Einkaufen',
    atLeastPartiallyWheelchairAccessibleButton: '~Teilweise rollstuhlgerecht oder besser',
    goButton: '~Los!',
    showMeWhereIAmButton: '~Show me where I am',
  },
}

function s(name) {
  return selectors[locale][name];
}

function waitAndTapElement(selector, width = 0, height = 0) {
  browser.waitForExist(selector, 10000);
  let location = browser.getLocation(selector);
  let size = browser.getElementSize(selector);
  if (location[0]) {
    location = location[0];
  }
  if (size[0]) {
    size = size[0];
  }
  const offset = {
    x: location.x + Math.floor(0.5 * (width || size.width)),
    y: location.y + Math.floor(0.5 * (height || size.height)),
  };
  browser.touchPerform([{
    action: 'tap',
    options: offset,
  }]);
}

function saveScreenshot(name) {
  const device = browser.desiredCapabilities.device;
  browser.saveScreenshot(`./fastlane/screenshots/${locale.replace(/_/,'-')}/${device}-${name}.png`);
}


describe('Screenshot flow', function () {
  it('should work', function () {
    // Set device location to a place with nice photos
    browser.setGeoLocation({ latitude: 52.5147041, longitude: 13.3904551, altitude: 70 });

    browser.waitUntil(function() {
      return browser.alertText();
    }, 30000);

    browser.pause(500);

    browser.alertAccept();

    waitAndTapElement(selectors.en_US.searchButton);
    waitAndTapElement(selectors.en_US.searchInput);
    browser.element(selectors.en_US.searchInput).keys(`locale:${browser.desiredCapabilities.locale}`);
    browser.element(selectors.en_US.searchInput).keys(['Enter']);

    waitAndTapElement(s('homeButton'));

    // const contexts = browser.contexts();
    // The app has two contexts, NATIVE_APP and WEBVIEW_n
    // browser.context(contexts[1]); // switch to webview context

    browser.waitForExist(s('startButton'), 10000);
    browser.pause(1000); // wait for panel to be animated
    saveScreenshot("StartScreen");

    waitAndTapElement(s('startButton'));
    browser.pause(1000); // wait for dialog to be gone
    saveScreenshot("Places");

    browser.execute('mobile: pinch', { scale: 1.6, velocity: 1 });
    browser.pause(3000); // wait for places to be loaded
    waitAndTapElement(s('placeMarker'), 15, 15);
    waitAndTapElement(s('expandButton'));
    browser.pause(1000); // wait for panel to be animated
    saveScreenshot("PlaceDetails");

    browser.pause(3000); // wait for images to be loaded
    waitAndTapElement(s('editButton'));
    browser.pause(1000); // wait for panel to be animated
    waitAndTapElement(s('partiallyOption'));
    browser.pause(1000); // wait for element to be clicked
    saveScreenshot("EditingStatus");

    waitAndTapElement(s('cancelButton'))
    waitAndTapElement(s('addImagesButton'))
    waitAndTapElement(s('cancelButton'))
    waitAndTapElement(s('searchButton'))
    waitAndTapElement(s('shoppingButton'))
    waitAndTapElement(s('atLeastPartiallyWheelchairAccessibleButton'))
    waitAndTapElement(s('goButton'))
    // Set device location to Hauptbahnhof, Berlin
    browser.setGeoLocation({ latitude: 52.5251, longitude: 13.3694, altitude: 70 });
    waitAndTapElement(s('showMeWhereIAmButton'))

    browser.execute('mobile: pinch', { scale: 1.3, velocity: 1 });
    browser.pause(3000); // wait for places to be loaded
    saveScreenshot("MainStation");
  });
});