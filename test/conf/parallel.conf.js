['BROWSERSTACK_USERNAME', 'BROWSERSTACK_ACCESS_KEY', 'BROWSERSTACK_APP_ID']
  .forEach(variableName => {
    if (!process.env[variableName]) {
      throw new Error(`Please define ${variableName} as environment variable.`);
    }
  });

const { flatten } = require('lodash');

const devicesByPlatform = {
  ios: [
    'iPhone 6S Plus',
    'iPhone 8',
    'iPhone X',
    'iPad Pro',
  ],
  android: [
    'Samsung Galaxy S9 Plus',
    'Google Pixel 2',
    'Samsung Galaxy Tab S3'
  ],
};

const devices = devicesByPlatform[process.env.FASTLANE_PLATFORM_NAME];

const locales = [
  'en_US',
  'de_DE',
  // 'da',
  // 'el',
  // 'es_ES',
  // 'fr-FR',
  // 'ja',
  // 'ru',
  // 'sv',
];

exports.config = {
  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY,

  updateJob: false,
  specs: [
    './test/specs/generateScreenshots.js'
  ],
  exclude: [],

  maxInstances: 2,

  commonCapabilities: {
    name: 'parallel_appium_test',
    build: 'webdriver-browserstack',
    app: process.env.BROWSERSTACK_APP_ID,
    'browserstack.debug': true
  },

  capabilities: flatten(devices.map(device => locales.map(locale => ({ device, locale })))),

  logLevel: 'verbose',
  coloredLogs: true,
  screenshotPath: './test/screenshots/',
  baseUrl: '',
  waitforTimeout: 15000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,

  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 40000
  }
};

// Code to support common capabilities
exports.config.capabilities.forEach(function(caps){
  for(var i in exports.config.commonCapabilities) caps[i] = caps[i] || exports.config.commonCapabilities[i];
});