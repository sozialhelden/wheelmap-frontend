# Wheelmap React.js frontend

This app is a refactored version of [Wheelmap](https://www.wheelmap.org)'s ‘classic’ Rails frontend. Its purpose is to split frontend and backend development and to make deployments as independent as possible of each other.

As of August 2017, the Rails application still contains frontend functions that we want to move into this React.js application, so the rewrite is not complete yet.

## Development

We bootstrapped this project with [Create React App](https://github.com/facebookincubator/create-react-app).

You can find the most recent version of the Create React App development guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

The app itself is a [React.js](https://facebook.github.io/react/) application.

It is served on the same domain as the backend API and fetches data from there.

## Deployment

To deploy the application:

- ask the backend maintainers to include your public SSH key in the authorized deployment keys
- Add hostnames for the staging/production systems to your `/etc/hosts`
- Log in once on the staging/production server
- Deploy the application with `yarn deploy-staging` or `yarn deploy-production`.

## Setting up / building the Cordova app

```bash
cordova prepare
cordova build
```