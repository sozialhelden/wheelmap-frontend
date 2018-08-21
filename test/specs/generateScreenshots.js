// var assert = require('assert');
// var expect = require('expect');
const { t, addLocale, useLocales } = require('ttag');
const { removeEmptyTranslations } = require('../../src/i18n');
const gettextParser = require('gettext-parser');
const fs = require('fs');
const path = require('path');
const { intersection } = require('lodash');

const locale = browser.desiredCapabilities.locale;
const loadedLocales = [];
const poDirPath = './public/i18n';

function loadLocalizationFromPOFile(locale, poFileContent) {
  const localization = gettextParser.po.parse(poFileContent);
  addLocale(locale, removeEmptyTranslations(localization));
  return localization;
}

function loadAllLocales() {
  fs.readDirSync(poDirPath)
  .forEach(poFilePath => {
    loadedLocales.push(path.basename(poFilePath, '.po'));
    const poFileContent = fs.readFileSync(poFilePath);
    loadLocalizationFromPOFile(poFileContent);
  });
}

loadAllLocales();
useLocales([locale, 'en-US']);

const selectors = {
  homeButton: t`Home`,
  startButton: t`Okay, let’s go!`,
  placeMarker: 'Bunte SchokoWelt' + ' ' + t`Fully wheelchair accessible`,
  editButton: t`Fully wheelchair accessible` + ' ' + t`Entrance has no steps, and all rooms are accessible without steps.`,
  expandButton: t`Expand details`,
  partiallyOption: t`Partially`,
  cancelButton: t`Cancel`,
  addImagesButton: t`Add images`,
  searchButton: t`Search`,
  searchInput: t`Search for place or address`,
  shoppingButton: t`Shopping`,
  atLeastPartiallyWheelchairAccessibleButton: t`Partially wheelchair accessible`,
  goButton: t`Go!`,
  showMeWhereIAmButton: t`Show me where I am`,
};

function s(name) {
  return '~' + selectors[name];
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
  it('accepts the location alert', function () {
    // Set device location to a place with nice photos
    browser.setGeoLocation({ latitude: 52.5147041, longitude: 13.3904551, altitude: 70 });

    browser.waitUntil(function() {
      return browser.alertText();
    }, 30000);

    browser.pause(500);

    browser.alertAccept();
  });

  if (browser.desiredCapabilities.locale !== 'en_US') {
    it('switches languages', function () {
      waitAndTapElement(selectors.en_US.startButton);
      waitAndTapElement(selectors.en_US.searchButton);
      waitAndTapElement(selectors.en_US.searchInput);
      browser.element(selectors.en_US.searchInput).keys(`locale:${browser.desiredCapabilities.locale}`);
      browser.element(selectors.en_US.searchInput).keys(['Enter']);
      browser.pause(3000); // wait for page to be reloaded
    });

    it('restarts the flow from the onboarding screen', function () {
      waitAndTapElement(s('homeButton'));

      // const contexts = browser.contexts();
      // The app has two contexts, NATIVE_APP and WEBVIEW_n
      // browser.context(contexts[1]); // switch to webview context

      browser.waitForExist(s('startButton'), 10000);
    });
  }

  it('shows places', function () {
    browser.pause(5000); // wait for translations to be loaded
    saveScreenshot("0-StartScreen");
    waitAndTapElement(s('startButton'));
    browser.pause(3000); // wait for dialog to be gone
    saveScreenshot("1-Places");
  });

  it('opens a single place\'s details (with nice photos!)', function () {
    browser.execute('mobile: pinch', { scale: 1.6, velocity: 0.5 });
    browser.pause(5000); // wait for places to be loaded
    waitAndTapElement(s('placeMarker'), 15, 15);
    waitAndTapElement(s('expandButton'));
    browser.pause(5000); // wait for panel to be animated
    saveScreenshot("2-PlaceDetails");
  });

  // it('switches to edit mode', function () {
  //   waitAndTapElement(s('editButton'));
  //   browser.pause(1000); // wait for panel to be animated
  //   waitAndTapElement(s('partiallyOption'));
  //   browser.pause(1000); // wait for element to be clicked
  //   saveScreenshot("EditingStatus");
  //   waitAndTapElement(s('cancelButton'))
  // });

  // it('switches to image adding', function () {
  //   waitAndTapElement(s('addImagesButton'))
  //   browser.pause(1000); // wait for panel to be animated
  //   saveScreenshot("AddImages");
  //   waitAndTapElement(s('cancelButton'))
  // });

  // it('filters visible places', function () {
  //   waitAndTapElement(s('searchButton'))
  //   waitAndTapElement(s('shoppingButton'))
  //   waitAndTapElement(s('atLeastPartiallyWheelchairAccessibleButton'))
  //   browser.execute('mobile: pinch', { scale: 0.25, velocity: 0.5 });
  //   browser.pause(10000); // wait for places to be loaded
  //   saveScreenshot("3-Filter");
  //   waitAndTapElement(s('goButton'))
  // });
  
  // it('shows a big train station', function () {
  //   // Set device location to Hauptbahnhof, Berlin
  //   browser.setGeoLocation({ latitude: 52.5251, longitude: 13.3694, altitude: 70 });
  //   waitAndTapElement(s('showMeWhereIAmButton'))
  //   browser.execute('mobile: pinch', { scale: 1.3, velocity: 1 });
  //   browser.pause(3000); // wait for places to be loaded
  //   saveScreenshot("MainStation");
  // });
});