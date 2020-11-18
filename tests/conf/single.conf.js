require('dotenv').config();
  // https://github.com/browserstack/webdriverio-browserstack
  exports.config = {
    user: process.env.BROWSERSTACK_USERNAME,
    key: process.env.BROWSERSTACK_ACCESS_KEY,
  
    updateJob: false,
    specs: [
      './tests/specs/single_test.js'
    ],
    exclude: [],
    maxInstances: 10,

    commonCapabilities: {
      project: "Wheelmap Webdriverio Browserstack Parallel Test",
      build: 'webdriver-browserstack',
      name: 'parallel_test',
      'browserstack.debug': true
    },

    capabilities: [{
      //      browser: process.env.BROWSERSTACK_TEST_BROWSER, // Chrome, Firefox, IE, Safari, Edge, Opera
      browser: 'chrome'
    },{
      browser: 'firefox'
    },{
      browser: 'IE'
    },{
      browser: 'safari'
    },{
      browser: 'edge'
    },{
      browser: 'opera'
    }],

    logLevel: 'warn',
    coloredLogs: true,
    screenshotPath: './screenshots/',
    baseUrl: '',
    waitforTimeout: 10000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    host: 'hub.browserstack.com',
  
    before: function () {
      var chai = require('chai');
      global.expect = chai.expect;
      chai.Should();
    },

    framework: 'mocha',
    mochaOpts: {
      ui: 'bdd',
      timeout: 60000
    },
  }

  // Code to support common capabilities
  exports.config.capabilities.forEach(function(caps){
    for(var i in exports.config.commonCapabilities) caps[i] = caps[i] || exports.config.commonCapabilities[i];
  });