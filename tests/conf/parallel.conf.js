require('dotenv').config();
const fs = require('fs');
const { setCurrentTest } = require('../lib/currentTest');

const isLocalBuild = process.env.BROWSERSTACK_LOCAL === '1';

function checkEnvironmentVariables() {
  const errorMessages = [];
  if (!process.env.BROWSERSTACK_USERNAME) {
    errorMessages.push('- Please set BROWSERSTACK_USERNAME to your BrowserStack username.');
  }
  if (!process.env.BROWSERSTACK_ACCESS_KEY) {
    errorMessages.push('- Please set BROWSERSTACK_ACCESS_KEY to your BrowserStack access key.');
  }
  if (!process.env.CI_TEST_DEPLOYMENT_BASE_URL) {
    errorMessages.push('- Please set CI_TEST_DEPLOYMENT_BASE_URL to the URL of the app to test.');
  }
  
  if (!isLocalBuild) {
    if (!process.env.CI_TEST_GIT_REF) {
      errorMessages.push('- Please set CI_TEST_GIT_REF to the git ref of the current build.');
    }
    if (!process.env.CI_TEST_GIT_SHA1) {
      errorMessages.push('- Please set CI_TEST_GIT_SHA1 to the git sha1 of the current build.');
    }
  }
  
  if (errorMessages.length > 0) {
    console.error('Error: Missing environment variables:');
    errorMessages.forEach((message) => console.error(message));
    process.exit(1);
  }
}

checkEnvironmentVariables();

// https://github.com/browserstack/webdriverio-browserstack
exports.config = {
  user: process.env.BROWSERSTACK_USERNAME, 
  bail: 1,
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
  specs: ['../specs/**/*.js'],
  exclude: [],
  maxInstances: 1,

  commonCapabilities: {
    'bstack:options': {
      project: 'Wheelmap Frontend',
      buildName: isLocalBuild
        ? 'Local build'
        : [process.env.CI_TEST_GIT_REF, process.env.CI_TEST_GIT_SHA1].join(' - '),
      'debug': true,
      // 'browserstack.local': `${isLocalBuild}`,
    }
  },

  // Use https://www.browserstack.com/automate/capabilities to create capability sets.
  // Be sure to set the generator to "W3C protocol".
  // Note we use Selenium v4: https://www.browserstack.com/automate/selenium-4
  // Tests should use https://webdriver.io/docs/api/webdriver.html directly if possible.
  // Some WDIO features are not yet ported to use the Webdriver protocol directly.

  capabilities: [
    {
      browserName: 'Chrome',
      'bstack:options': {
        browserVersion: 'latest',
        os: 'OS X',
        osVersion: 'Sonoma',
        userName: 'holgerdieterich1',
        accessKey: 'S2Lp7oshaL7SB38mn2TC',
        selfHeal: true,
      },
      'goog:chromeOptions': {
        prefs: {
          // 0 - Default, 1 - Allow, 2 - Block
          'profile.managed_default_content_settings.geolocation': 1,
        },
      },
    },
    // {
    //   browserName: 'Firefox',
    //   'bstack:options': {
    //     browserVersion: '127.0',
    //     os: 'Windows',
    //     osVersion: '11',
    //     selfHeal: true,
    //     userName: 'holgerdieterich1',
    //     accessKey: 'S2Lp7oshaL7SB38mn2TC',
    //   }
    // },
    // {
    //   'bstack:options': {
    //     os: 'OS X',
    //     osVersion: 'Big Sur',
    //     local: 'false',
    //     seleniumVersion: '4.0.0-alpha-6',
    //     userName: 'holgerdieterich1',
    //     accessKey: 'S2Lp7oshaL7SB38mn2TC',
    //     seleniumLogs: true,
    //   },
    //   browserName: 'Safari',
    //   browserVersion: '14.0',
    // },
    // {
    //   browserName: 'Edge',
    //   'bstack:options': {
    //     browserVersion: '125.0',
    //     os: 'Windows',
    //     osVersion: '11',
    //     userName: 'holgerdieterich1',
    //     accessKey: 'S2Lp7oshaL7SB38mn2TC',
    //     selfHeal: true,
    //   }
    // },
    // {
    //   browserName: 'safari',
    //   'bstack:options': {
    //     deviceOrientation: 'portrait',
    //     deviceName: 'iPhone 12 Mini',
    //     osVersion: '16',
    //     // autoAcceptAlerts: 'true',
    //   }
    // },
    // {
    //   browserName: 'samsung',
    //   // This doesn't work - we have to manually accept the alert dialog
    //   'bstack:options': {
    //     // autoGrantPermissions: 'true',
    //     deviceOrientation: 'portrait',
    //     deviceName: 'Samsung Galaxy S22',
    //     osVersion: '12.0'
    //   }
    // }
  ],

  logLevel: 'warn',
  coloredLogs: true,
  screenshotPath: './screenshots/',
  baseUrl: process.env.CI_TEST_DEPLOYMENT_BASE_URL,
  waitforTimeout: 20000,
  waitforInterval: 1000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  specFileRetries: 0,
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
