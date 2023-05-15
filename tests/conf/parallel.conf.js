const fs = require('fs');
const { setCurrentTest } = require('../lib/currentTest');

const isLocalBuild = process.env.BROWSERSTACK_LOCAL === '1';

// https://github.com/browserstack/webdriverio-browserstack
exports.config = {
  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY,

  services: [
    [
      'browserstack',
      {
        browserstackLocal: isLocalBuild,
      },
    ],
  ],

  updateJob: false,
  specs: ['./tests/specs/**/*.js'],
  exclude: [],
  maxInstances: 2,

  commonCapabilities: {
    project: 'Wheelmap Frontend',
    build: isLocalBuild
      ? 'Local build'
      : [process.env.CI_TEST_GIT_REF, process.env.CI_TEST_GIT_SHA1].join(' - '),
    // name: 'parallel_test',
    'browserstack.debug': true,
    'browserstack.local': 'false',
  },

  // Use https://www.browserstack.com/automate/capabilities to create capability sets.
  // Be sure to set the generator to "W3C protocol".
  // Note we use Selenium v4: https://www.browserstack.com/automate/selenium-4
  // Tests should use https://webdriver.io/docs/api/webdriver.html directly if possible.
  // Some WDIO features are not yet ported to use the Webdriver protocol directly.

  capabilities: [
    {
      os: 'OS X',
      os_version: 'Catalina',
      browserName: 'Chrome',
      browser_version: '87',
      'browserstack.selenium_version': '4.0.0-alpha-6',
      autoAcceptAlerts: 'true',
      'goog:chromeOptions': {
        prefs: {
          // 0 - Default, 1 - Allow, 2 - Block
          'profile.managed_default_content_settings.geolocation': 1,
        },
      },
    },
    {
      os: 'Windows',
      os_version: '7',
      browserName: 'Firefox',
      browser_version: 'latest',
      autoAcceptAlerts: 'true',
      'browserstack.selenium_version': '3.10.0',
    },
    {
      'bstack:options': {
        os: 'OS X',
        osVersion: 'Big Sur',
        local: 'false',
        seleniumVersion: '4.0.0-alpha-6',
        userName: 'holgerdieterich1',
        accessKey: 'S2Lp7oshaL7SB38mn2TC',
        seleniumLogs: true,
      },
      browserName: 'Safari',
      browserVersion: '14.0',
    },
    {
      'bstack:options': {
        os: 'Windows',
        osVersion: '10',
        local: 'false',
        seleniumVersion: '4.0.0-alpha-6',
        userName: 'holgerdieterich1',
        accessKey: 'S2Lp7oshaL7SB38mn2TC',
      },
      browserName: 'Edge',
      browserVersion: 'latest',
      autoAcceptAlerts: 'true',
    },
    {
      os_version: '14',
      device: 'iPhone 12',
      real_mobile: 'true',
      browserName: 'iPhone',
      autoAcceptAlerts: 'true',
      'browserstack.appium_version': '1.19.1',
    },
    {
      os_version: '10.0',
      device: 'Samsung Galaxy S20',
      real_mobile: 'true',
      'browserstack.appium_version': '1.19.1',
      browserName: 'Android',
      // This doesn't work - we have to manually accept the alert dialog
      autoAcceptAlerts: 'true',
    },
  ],

  logLevel: 'warn',
  coloredLogs: true,
  screenshotPath: './screenshots/',
  baseUrl: process.env.CI_TEST_DEPLOYMENT_BASE_URL,
  waitforTimeout: 20000,
  waitforInterval: 1000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  specFileRetries: 2,
  host: 'hub.browserstack.com',

  beforeSuite: function() {
    // var chai = require('chai');
    // global.expect = chai.expect;
    // chai.Should();
    console.log('Capabilities:', browser.capabilities);
  },

  afterSuite: function() {
    console.log('BrowserStack session ID:', browser.sessionId);
    const url = `https://automate.browserstack.com/dashboard/v2/sessions/${browser.sessionId}`;
    console.log('BrowserStack dashboard URL: ', url);
    fs.writeFileSync('/tmp/test-result-url.txt', url);
  },

  beforeTest: function(test, context) {
    global.currentContext = context;
  },

  onPrepare() {
    console.log('Cleaning screenshots directory…');
    if (fs.existsSync('screenshots')) {
      fs.rmdirSync('screenshots', { recursive: true });
    }
  },

  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },
};

// Code to support common capabilities
exports.config.capabilities.forEach(function(caps) {
  for (var i in exports.config.commonCapabilities)
    caps[i] = caps[i] || exports.config.commonCapabilities[i];
});
