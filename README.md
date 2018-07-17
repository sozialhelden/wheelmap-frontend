# Wheelmap React.js frontend

This app is a refactored version of [Wheelmap](https://www.wheelmap.org)'s ‘classic’ Rails frontend.
Its purpose is to split frontend and backend development and to make deployments as independent as
possible of each other.

As of August 2017, the Rails application still contains frontend functions that we want to move into
this React.js application, so the rewrite is not complete yet.


## Setup

Prepare the environment

```
# npm dependencies
yarn install
# fastlane dependencies
bundle install
# cordova
npx cordova prepare android
npx cordova prepare ios
```

## Development

We bootstrapped this project with [Create React App](https://github.com/facebookincubator/create-react-app).

You can find the most recent version of the Create React App development guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

The app itself is a [React.js](https://facebook.github.io/react/) application, and re-packaged into
[Cordova](https://cordova.apache.org/docs/en/latest/config_ref/) apps for Android and iOS.

The web server serves the app as static page, running on the same domain as the backend API.


### Recompile SVG
All svg-graphics have to be converted to react JS components, e.g. with...

```
yarn compile-svgs
```

Check the `package.json` defines additional yarn tasks that can speed up this task.


## Website deployment

To deploy the web application:

- ask the backend maintainers to include your public SSH key in the authorized deployment keys
- Add hostnames for the staging/production systems to your `/etc/hosts`
- Log in once on the staging/production server
- Deploy the application with `yarn deploy-staging` or `yarn deploy-production`.

## Setting up / building the Cordova apps

```bash
npx cordova prepare android ios
# for ios
npm run build-ios
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
- Pre-test the builds with local devices
- Run `npm run deploy-ios-beta` to upload an internal Testflight build
- Run `npm run deploy-android-beta` to upload a public (← ⚠️) PlayStore beta build

Note that each deployment increments the app version's patch level by one.

## Testing

<a href="https://browserstack.com"><img src="public/images/Browserstack-logo.svg" width="200px"></a>

For testing the apps, we use [BrowserStack](https://browserstack.com). More documentation about how to run the test suites are going to appear here soon.


