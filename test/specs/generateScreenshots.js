// var assert = require('assert');
// var expect = require('expect');

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


describe('Start screen', function () {
  it('should be shown', function () {
    // Set device location to Hauptbahnhof, Berlin
    browser.setGeoLocation({ latitude: 52.5251, longitude: 13.3694, altitude: 70 });

    browser.waitUntil(function() {
      return browser.alertText();
    }, 30000);

    browser.pause(500);

    browser.alertAccept();

    // const contexts = browser.contexts();
    // The app has two contexts, NATIVE_APP and WEBVIEW_n
    // browser.context(contexts[1]); // switch to webview context
    waitAndTapElement('~Okay, let’s go!');

    browser.pause(3000); // wait for places to be loaded
    browser.execute('mobile: pinch', { scale: 1.5, velocity: 0.5 });
    browser.pause(10000); // wait for places to be loaded

    waitAndTapElement('~Search');
    waitAndTapElement('~Shopping');
    waitAndTapElement('~At least partially wheelchair accessible');
    waitAndTapElement('~Go!');

    // Set device location to a place with nice photos
    browser.setGeoLocation({ latitude: 52.5147041, longitude: 13.3904551, altitude: 70 });
    waitAndTapElement('~Show me where I am');
    browser.pause(3000); // wait for places to be loaded
    browser.execute('mobile: pinch', { scale: 1.5, velocity: 0.5 });
    browser.pause(10000); // wait for places to be loaded
    waitAndTapElement('~Bunte SchokoWelt Fully wheelchair accessible', 15, 15);
    waitAndTapElement('~Expand panel');
    browser.pause(3000); // wait for images to be loaded
    waitAndTapElement('~Fully wheelchair accessible Entrance has no steps, and all rooms are accessible without steps.');
    waitAndTapElement('~Partially');
    waitAndTapElement('~Back');
    waitAndTapElement('~Add images');
    waitAndTapElement('~Cancel');
  });
});