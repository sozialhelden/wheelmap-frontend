module.exports = async function acceptLocationAlertOnMobilesIfPresent() {
  // Check if we are in an environment with a separate native app and a web view context
  if (browser.getContexts) {
    // We're on a mobile
    const contexts = await browser.getContexts();
    console.log('Contexts:', contexts);
    if (contexts.find(c => c === 'NATIVE_APP')) {
      console.log('Accepting location alert...');
      await browser.switchContext('NATIVE_APP');
      if (browser.capabilities.platform === 'ANDROID') {
        const $allowButton = await $("//android.widget.Button[@text='Allow']");
        await $allowButton.waitForExist();
        await $allowButton.click();
      }

      await browser.switchContext(contexts.find(c => c.match(/^WEBVIEW/) || c.match(/CHROMIUM/)));
    }
  }
};
