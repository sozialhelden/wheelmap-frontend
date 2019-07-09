# Wheelmap React.js frontend

This app is a refactored version of [Wheelmap](https://www.wheelmap.org)'s ‘classic’ Rails frontend.
Its purpose is to split frontend and backend development and to make deployments as independent as
possible of each other.


## Setup

Prepare the environment

```bash
# Environment variables
cp .env.test .env.development

# npm dependencies
npm install

# install transifex i18n / localization tool
pip install transifex-client
```


## Development

We bootstrapped this project with [Create React App](https://github.com/facebookincubator/create-react-app).

You can find the most recent version of the Create React App development guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

The app itself is a [React.js](https://facebook.github.io/react/) application, and wrapped into native apps for Android and iOS.

The web server serves the app as static page, running on the same domain as the backend API.


### Recompile SVG

You have to convert SVG graphics to React JS components, e.g. with…

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


## Embed/Widget Mode of Wheelmap

The wheelmap web app can be embedded in any other website with embed code like this:

```<iframe style="width: 600px; height: 600px;" src="https://wheelmap.org?embedded=true&embedToken=12345&lat=52.5212&lon=13.4104" allow="geolocation"></iframe>```

Having the `embedded=true` query parameter attached to the URL ensures that the website is rendered with less UI (no search, no header etc.) and `allow="geolocation"` is essential so that the iframe is allowed to access the browser's locate feature.
The widget as with the app in general can be configured to initially position the map at a certain lat/lon with respective parameters.
The app disallows embedding via `<iframe>` if no valid `embedToken` for the app is provided. These embed tokens can be created in the widget options in the admin interface of the app.


## Translation process

Ensure the transifex client is correctly setup https://docs.transifex.com/client/client-configuration#-transifexrc

Use `npm run push-translations` to push a new translation resource to our translation service [transifex](http://transifex.com).

We deploy every new feature in English and German first, and add support for all 27 languages in the following sprint.

When there are new strings on transifex, you can run `npm run pull-translations` to pull them into the local project.

Then run `npm run create-js-translations` to inject the translations into the application.

We have a retranslate tool that allows to use the `en_US` language on transifex to refine source strings directly in the source code. This parses the whole source code into an abstract syntax tree using Babel, then re-assembles it with new versions of the strings fetched from the `en_US` locale. Re-assembly can break formatting.


## Testing

<a href="https://browserstack.com"><img src="src/static/images/Browserstack-logo.svg" width="200px"></a>

For testing the apps, we use [BrowserStack](https://browserstack.com). More documentation about how to run the test suites are going to appear here soon.


## Contributing Data and Code

- You have a related project? You want your accessibility data visible on Wheelmap.org and in other apps, or your project would profit from Wheelmap.org’s data? Register an account on [accessibility.cloud](https://www.accessibility.cloud) (Wheelmap.org’s backend) and [contact us](mailto:support@accessibility.cloud)!
- For reporting bugs or other issues, please create issues on our [GitHub issue tracker](https://github.com/sozialhelden/wheelmap-react-frontend/issues).
- If you have a concrete bugfix, you can create a pull request - please create an issue first so we can organize collaboration together.
