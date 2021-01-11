var webdriver = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");
let helper = require("./helper");

// Input capabilities
var capabilities = {
  // "bstack:options": {
  os: "Windows",
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
      "profile.managed_default_content_settings.geolocation": 1
    }
  }
};

(async function run() {
  let driver;

  try {
    driver = await new webdriver.Builder()
      .usingServer("http://hub-cloud.browserstack.com/wd/hub")
      .withCapabilities(capabilities)
      .build();

    const waitFind = locator => {
      return driver.findElement(async () => {
        await driver.wait(webdriver.until.elementLocated(locator));
        return driver.findElement(locator);
      });
    };

    await driver.get("http://wheelmap.org");
    await waitFind(webdriver.By.css(".button-continue-with-cookies")).click();
    await waitFind(webdriver.By.name("search")).sendKeys(
      "Alexanderplatz" + webdriver.Key.ENTER
    );
    await waitFind(webdriver.By.className("search-results")); // wait for displayed
    //await helper.saveScreenshot(driver, "search-results-are-displayed.png");
    await waitFind(webdriver.By.css('h1[class^="PlaceName"]')).click();
    await waitFind(
      webdriver.By.css('[class="leaflet-control-zoom-out"]')
    ).click();
    await waitFind(
      webdriver.By.css('[class="leaflet-control-zoom-out"]')
    ).click();
    await waitFind(
      webdriver.By.css('[class="leaflet-control-zoom-out"]')
    ).click();
    await waitFind(
      webdriver.By.css('[class="leaflet-control-zoom-out"]')
    ).click();

    await waitFind(
      webdriver.By.css('[class="leaflet-control-zoom-in"]')
    ).click();
    await waitFind(
      webdriver.By.css('[class="leaflet-control-zoom-in"]')
    ).click();
    await waitFind(
      webdriver.By.css('[class="leaflet-control-zoom-in"]')
    ).click();
    await waitFind(
      webdriver.By.css('[class="leaflet-control-zoom-in"]')
    ).click();
    await waitFind(
      webdriver.By.css('[class="leaflet-control-zoom-in"]')
    ).click();
    await waitFind(
      webdriver.By.css('[class="leaflet-control-zoom-in"]')
    ).click();

    await helper.saveScreenshot(driver, `zoom-out-of.location.png`);
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
})();
