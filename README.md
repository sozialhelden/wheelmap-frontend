# [<img alt="Wheelmap.org" src='./doc/wheelmap-logo.svg' width="200" style="vertical-align: middle;">](https://wheelmap.org)

[Wheelmap.org](https://www.wheelmap.org) by [Sozialhelden e.V.](https://sozialhelden.de) is the world’s largest free online map for accessible places.

[<img alt="Sozialhelden e.V." src='./doc/sozialhelden-logo.svg' width="200" style="vertical-align: middle;">](https://sozialhelden.de)

This project contains the Node.js/React.js-based frontend for the app.

## Development

The app itself is a [React.js](https://facebook.github.io/react/) application, and [wrapped into native apps](https://github.com/sozialhelden/wheelmap-native-wrapper) for Android and iOS. [Next.js](https://nextjs.org) provides a server and webpack compilation process. For CSS styling, we use [styled-components](https://www.styled-components.com).

The web server serves the app as server-side rendered static page, and runs on the same domain as the backend API in production.

### Setup

Prepare your development environment:

```bash
# Environment variables
cp .env.example .env

# npm dependencies
npm install

# install transifex i18n / localization tool
pip install transifex-client

# start a local test web server
npm run dev
```

You will get some error messages from the Elastic APM client (our error collector for both [server](https://www.elastic.co/products/apm) and [client](https://www.elastic.co/guide/en/apm/agent/rum-js/4.x/getting-started.html)). If you want to test/develop the Elastic APM integration, you can get a valid token from the project maintainers.

You can configure the app using process environment variables or a `.env` file. Process environment variables override values set in the `.env` file.

### Recompile SVG

You have to convert SVG graphics to React JS components to make them styleable with CSS. Run this command:

```bash
npm run compile-svgs
```

Check `package.json`, it defines more scripts that can speed up this task.

## Website deployment

To deploy the web application:

- ask the backend maintainers to include your public SSH key in the authorized deployment keys
- Add hostnames for the staging/production systems to your `/etc/hosts`
- Log in once on the staging/production server
- Deploy the application with `npm run deploy-staging` or `npm run deploy-production`.

## Embedding Wheelmap as a widget on other websites

You can embed the Wheelmap web app in any other website’s HTML like this:

`<iframe style="width: 600px; height: 600px;" src="https://wheelmap.org?embedded=true&embedToken=12345&lat=52.5212&lon=13.4104" allow="geolocation"></iframe>`

Having the `embedded=true` query parameter attached to the URL ensures that the app renders less UI (no search, no header etc.). Add `allow="geolocation"` to let the `<iframe>` access the browser’s location feature.
Like the full app, the widget can initially position the map at a certain location defined by `lat` and `lon` URL parameters.
The app disallows embedding via `<iframe>` if you provide no valid `embedToken` URL parameter. You can create an embed token on accessibility.cloud’s app admin interface (in the widget options).

## Translation process

Ensure the transifex client is setup <https://docs.transifex.com/client/client-configuration#-transifexrc>

Use `npm run push-translations` to push a new translation resource to our translation service [transifex](http://transifex.com).

We deploy every new feature in English and German first, and add support for all languages in the following sprint.

After pushing new strings, translators can begin translating them on [Transifex](https://www.transifex.com/sozialhelden/wheelmap-react-frontend/translate/#de/translationspot/335454735?q=translated%3Ano).

When there are new strings on transifex, you can run `npm run pull-translations` to pull them into the local project and to inject the translations into the application.

We have a retranslate tool that allows to use the `en_US` language on transifex to refine source strings directly in the source code. This parses the whole source code into an abstract syntax tree using Babel, then re-assembles it with new versions of the strings fetched from the `en_US` locale. Re-assembly can break formatting.

## Testing

For testing the apps, we use [PlayWright](https://playwright.dev) (which enables quick E2E tests locally and on CI) and [BrowserStack](https://browserstack.com) (for testing manually with [BrowserStack Live](https://www.browserstack.com/live)). We thank the PlayWright and BrowserStack teams for their great products and their support! ❤️

<a href="https://browserstack.com"><img src="public/images/Browserstack-logo.svg" width="200px"></a>

### Testing locally

To test locally,
- [Install the PlayWright VSCode extension](https://playwright.dev/docs/getting-started-vscode),
- Run `npx playwright install --with-deps` to install PlayWright's browser binaries,
- Run `npm run test`.

### Testing via CI

New code is automatically tested on pushing it to the git repository. GitHub displays the test status next to commits.

## Contributing data and code

- You have a related project? You want your accessibility data visible on Wheelmap.org and in other apps, or your project would profit from Wheelmap.org’s data? Register an account on [accessibility.cloud](https://www.accessibility.cloud) (Wheelmap.org’s backend) and [contact us](mailto:support@accessibility.cloud)!
- For reporting bugs or other issues, please create issues on our [GitHub issue tracker](https://github.com/sozialhelden/wheelmap-react-frontend/issues).
- If you have a concrete bugfix, you can create a pull request - please create an issue first so we can organize collaboration together.

## Code of Conduct
https://argo.i.wheelmap.tech/artifact-files/argo-events/workflows/deploy-branch-crrqq/deploy-branch-crrqq-479967441/outputs/test-artifacts
We follow the [Berlin Code of Conduct](https://berlincodeofconduct.org).
