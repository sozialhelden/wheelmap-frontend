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
yarn install

# fastlane dependencies
bundle install

# cordova
npx cordova prepare android
npx cordova prepare ios

# install transifex i18n / localization tool
pip install transifex-client 
```

## Development

We bootstrapped this project with [Create React App](https://github.com/facebookincubator/create-react-app).

You can find the most recent version of the Create React App development guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

The app itself is a [React.js](https://facebook.github.io/react/) application, and re-packaged into
[Cordova](https://cordova.apache.org/docs/en/latest/config_ref/) apps for Android and iOS.

The web server serves the app as static page, running on the same domain as the backend API.

### Recompile SVG

You have to convert SVG graphics to React JS components, e.g. with…

```bash
yarn compile-svgs
```

Check `package.json`, it defines more scripts that can speed up this task.

## Website deployment

To deploy the web application:

- ask the backend maintainers to include your public SSH key in the authorized deployment keys
- Add hostnames for the staging/production systems to your `/etc/hosts`
- Log in once on the staging/production server
- Deploy the application with `yarn deploy-staging` or `yarn deploy-production`.


## Embed/Widget Mode of Wheelmap

The wheelmap web app can be embedded in any other website with embed code like this:

```<iframe style="width: 600px; height: 600px;" src="https://wheelmap.org?embedded=true" allow="geolocation"></iframe>```

Having the `embedded=true` query parameter attached to the URL ensures that the website is rendered with less UI (no search, no header etc.) and `allow="geolocation"` is essential so that the iframe is allowed to access the browser's locate feature.

## Setting up / building the Cordova apps

Before this, you need a `.env.production` file in your root folder. If you already have `.env.development`, you can copy it.

```bash
npx cordova prepare android ios
# for ios
APPLE_DEVELOPER_USERNAME=… npm run build-ios # replace `…` with your developer account email address
# for android
npm run build-android
```

Be sure to move Cordova's `package.json` dependencies into `devDependencies` after installation.

## Deploying the Cordova apps to Google Play Store and Apple App Store

We use [`fastlane`](https://fastlane.tools/) for deploying beta and production apps.

To deploy:

- get access to the shared certificate repository for [fastlane match](https://docs.fastlane.tools/actions/match/)
- get a `.env.production` file from the person in charge
- Make Cordova builds for iOS and Android like described above
- Pre-test the builds with local devices. You can open the Xcode project with `open platforms/ios/Wheelmap.xcworkspace`.
- Run `APPLE_DEVELOPER_USERNAME=… npm run deploy-ios-beta` to upload an internal Testflight build (set `…` to your Apple developer email account address)
- Run `npm run deploy-android-beta` to upload a public (← ⚠️) PlayStore beta build

Note that each deployment increments the app version's patch level by one.

Before deploying new versions:

- Please test every app feature before deploying.
- Ensure that translated strings show up translated in the UI. Set your device/browser language to anything else than `en-US` to test this.
- If a new feature needs new strings, coordinate necessary translation tasks with the rest of the team. Sometimes, other features might already provide the strings you need – reuse them!
- Test new features inside the Cordova iOS/Android apps. Cordova has some differences because it serves the app from the file system, which affects CORS and other security features. Running inside an in-app browser means that features like alert dialogs or opening something in a new tab work differently. We use a wrapper around `fetch()` and the a cordova HTTP plugin to overcome some of these limitations.

## Translation process

Use `npm run push-translations` to push a new translation resource to our translation service [transifex](http://transifex.com).

We deploy every new feature in English and German first, and add support for all 27 languages in the following sprint.

When there are new strings on transifex, you can run `npm run pull-translations` to pull them into the local project.

We have a retranslate tool that allows to use the `en_US` language on transifex to refine source strings directly in the source code. This parses the whole source code into an abstract syntax tree using Babel, then re-assembles it with new versions of the strings fetched from the `en_US` locale. Re-assembly can break formatting.

## Testing

<a href="https://browserstack.com"><img src="src/static/images/Browserstack-logo.svg" width="200px"></a>

For testing the apps, we use [BrowserStack](https://browserstack.com). More documentation about how to run the test suites are going to appear here soon.

## Contributing Data and Code

- You have a related project? You want your accessibility data visible on Wheelmap.org and in other apps, or your project would profit from Wheelmap.org’s data? Register an account on [accessibility.cloud](https://www.accessibility.cloud) (Wheelmap.org’s backend) and [contact us](mailto:support@accessibility.cloud)!
- For reporting bugs or other issues, please create issues on our [GitHub issue tracker](https://github.com/sozialhelden/wheelmap-react-frontend/issues).
- If you have a concrete bugfix, you can create a pull request - please create an issue first so we can organize collaboration together.
