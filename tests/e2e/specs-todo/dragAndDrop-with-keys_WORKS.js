const webdriver = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require("node:fs");
const helper = require("./helper");

// Input capabilities
const capabilities = {
  osVersion: "10",
  local: "false",
  //'seleniumVersion' : '4.0.0-alpha.5',
  debug: "true",
  consoleLogs: "info",
  browserName: "Chrome",
  browser_version: "75.0",
  os: "Windows",
  os_version: "10",

  // SET CHROME OPTIONS
  "goog:chromeOptions": {
    prefs: {
      // 0 - Default, 1 - Allow, 2 - Block
      "profile.managed_default_content_settings.geolocation": 1,
    },
  },
};

(async function run() {
  let driver;

  try {
    driver = await new webdriver.Builder()
      .usingServer("http://hub-cloud.browserstack.com/wd/hub")
      .withCapabilities(capabilities)
      .build();

    const waitFind = (locator) => {
      return driver.findElement(async () => {
        await driver.wait(webdriver.until.elementLocated(locator));
        return driver.findElement(locator);
      });
    };

    await driver.get("http://wheelmap.org");
    await waitFind(webdriver.By.css(".button-continue-with-cookies")).click();
    await waitFind(webdriver.By.name("search")).sendKeys(
      `Alexanderplatz${webdriver.Key.ENTER}`,
    );
    await waitFind(webdriver.By.className("search-results")); // wait for displayed
    await waitFind(webdriver.By.css('h1[class^="PlaceName"]')).click();
    await waitFind(
      webdriver.By.css('[class="leaflet-control-zoom-in"]'),
    ).click();
    await waitFind(
      webdriver.By.css('[class="leaflet-control-zoom-in"]'),
    ).click();

    await helper.saveScreenshot(driver, "drag-and-drop-WITH-KEYS_BEFORE.png");

    await waitFind(webdriver.By.css('[aria-label="Map"]')).sendKeys(
      webdriver.Key.ARROW_RIGHT,
    );
    await waitFind(webdriver.By.css('[aria-label="Map"]')).sendKeys(
      webdriver.Key.ARROW_RIGHT,
    );
    await waitFind(webdriver.By.css('[aria-label="Map"]')).sendKeys(
      webdriver.Key.ARROW_RIGHT,
    );
    await waitFind(webdriver.By.css('[aria-label="Map"]')).sendKeys(
      webdriver.Key.ARROW_RIGHT,
    );
    await waitFind(webdriver.By.css('[aria-label="Map"]')).sendKeys(
      webdriver.Key.ARROW_RIGHT,
    );

    await helper.saveScreenshot(driver, "drag-and-drop-WITH-KEYS_AFTER.png");
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
})();

// it('searches for a place via categories', () => {
//   browser.saveScreenshot('./screenshots/012-0-before-search.png')
//   const input = browser.$('[name="search"]')
//   input.click();

//   const foodAndDrinkButton = browser.$('[aria-label="Food & Drinks"]');
//   foodAndDrinkButton.click();
//   browser.saveScreenshot('./screenshots/012-1-before-search.png')

//   const fullyAccessibleMenuButton = browser.$('[aria-label="Only fully wheelchair accessible"]');
//   fullyAccessibleMenuButton.click();
//   browser.saveScreenshot('./screenshots/012-2-before-search.png')

//   browser.saveScreenshot('./screenshots/013-after-search.png')

// });
