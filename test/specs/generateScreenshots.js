// var assert = require('assert');
// var expect = require('expect');

const locale = "en_US";

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
    saveScreenshot("StartScreen");

    // const contexts = browser.contexts();
    // The app has two contexts, NATIVE_APP and WEBVIEW_n
    // browser.context(contexts[1]); // switch to webview context
    waitAndTapElement('~Okay, let’s go!');
    browser.pause(1000); // wait for dialog to be gone

    saveScreenshot("Places");

    browser.execute('mobile: pinch', { scale: 1.6, velocity: 1 });
    browser.pause(3000); // wait for places to be loaded

    waitAndTapElement('~Bunte SchokoWelt Fully wheelchair accessible', 15, 15);
    waitAndTapElement('~Expand panel');
    browser.pause(1000); // wait for panel to be animated
    saveScreenshot("PlaceDetails");
    browser.pause(3000); // wait for images to be loaded
    waitAndTapElement('~Fully wheelchair accessible Entrance has no steps, and all rooms are accessible without steps.');
    browser.pause(1000); // wait for panel to be animated
    waitAndTapElement('~Partially');
    browser.pause(1000); // wait for element to be clicked

    saveScreenshot("EditingStatus");
    waitAndTapElement('~Cancel');
    waitAndTapElement('~Add images');
    waitAndTapElement('~Cancel');

    waitAndTapElement('~Search');
    waitAndTapElement('~Shopping');
    waitAndTapElement('~At least partially wheelchair accessible');
    waitAndTapElement('~Go!');

    // Set device location to Hauptbahnhof, Berlin
    browser.setGeoLocation({ latitude: 52.5251, longitude: 13.3694, altitude: 70 });
    waitAndTapElement('~Show me where I am');

    browser.execute('mobile: pinch', { scale: 1.3, velocity: 1 });
    browser.pause(3000); // wait for places to be loaded
    saveScreenshot("MainStation");
  });
});