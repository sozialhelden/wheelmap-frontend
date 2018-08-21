fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew cask install fastlane`

# Available Actions
## iOS
### ios local
```
fastlane ios local
```
Create a local iOS build with Cordova
### ios beta
```
fastlane ios beta
```
Push a new beta build to TestFlight and HockeyApp
### ios screenshots
```
fastlane ios screenshots
```
Make screenshots for App Store
### ios publish
```
fastlane ios publish
```
Upload beta build as release to App Store

----

## Android
### android local
```
fastlane android local
```
Create a local Android build with Cordova
### android screenshots
```
fastlane android screenshots
```
Make screenshots for PlayStore
### android beta
```
fastlane android beta
```
Push a new alpha build to Google Play Store

----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
