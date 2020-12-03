require('dotenv').config();
// const testDeploymentBaseUrl = process.env.BASE_URL;
// const testDeploymentBaseUrl = "https://wheelmap.org";

describe('Wheelmap main page', () => {
  it('has a title', () => {
    browser.url('/');
    // $('[name="q"]').setValue('BrowserStack');
    // browser.keys("\uE007"); // somehow cant click, not reachable
    // $('[name="btnK"]').click();
    browser.getTitle().should.match(/Wheelmap – Find wheelchair accessible places./i);
  });
});
