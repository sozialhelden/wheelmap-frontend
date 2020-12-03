require('dotenv').config();
// const testDeploymentBaseUrl = process.env.BASE_URL;
// const testDeploymentBaseUrl = "https://wheelmap.org";
const testDeploymentBaseUrl = process.env.CI_TEST_DEPLOYMENT_BASE_URL;

console.log('Running test against this URL:', testDeploymentBaseUrl);

describe('Wheelmap main page', () => {
  it('has a title', () => {
    browser.url(testDeploymentBaseUrl);
    // $('[name="q"]').setValue('BrowserStack');
    // browser.keys("\uE007"); // somehow cant click, not reachable
    // $('[name="btnK"]').click();
    browser.getTitle().should.match(/Wheelmap – Find wheelchair accessible places./i);
  });
});
