const { mkdirp } = require('fs-extra');

const currentSteps = {};

module.exports = async function saveScreenshot(basename) {
  const title = currentContext.test.fullTitle();
  const dirname = `screenshots/${(
    browser.capabilities.browser_name || browser.capabilities.browserName
  ).toLowerCase()}/${title}`;
  currentSteps[title] = (currentSteps[title] || 0) + 1;
  const step = currentSteps[title];
  await mkdirp(dirname);
  const filename = `${dirname}/${step}-${basename}.png`;
  console.log(`Saved ${filename}.`);
  await browser.saveScreenshot(filename);
};
