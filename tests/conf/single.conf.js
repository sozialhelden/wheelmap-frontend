require('dotenv').config();
const fs = require('fs');

// https://github.com/browserstack/webdriverio-browserstack
exports.config = {
  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY,

  updateJob: false,
  specs: ['./tests/specs/**/*.js'],
  exclude: [],
  maxInstances: 10,

  commonCapabilities: {
    project: 'Wheelmap Webdriverio Browserstack Parallel Test',
    build: 'webdriver-browserstack',
    name: 'parallel_test',
    'browserstack.debug': true,
  },

  capabilities: [
    {
      browser: 'chrome',
    },
    // {
    //   browser: 'firefox',
    // },
    // {
    //   browser: 'IE',
    // },
    // {
    //   browser: 'safari',
    // },
    // {
    //   browser: 'edge',
    // },
    // {
    //   browser: 'opera',
    // },
  ],

  logLevel: 'warn',
  coloredLogs: true,
  screenshotPath: './screenshots/',
  baseUrl: process.env.CI_TEST_DEPLOYMENT_BASE_URL,
  waitforTimeout: 10000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  host: 'hub.browserstack.com',

  before: function() {
    var chai = require('chai');
    global.expect = chai.expect;
    chai.Should();
  },

  after: function() {
    console.log('BrowserStack session ID:', browser.sessionId);
    const url = `https://automate.browserstack.com/dashboard/v2/sessions/${browser.sessionId}`;
    console.log('BrowserStack dashboard URL: ', url);
    fs.writeFileSync('/tmp/test-result-url.txt', url);
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
