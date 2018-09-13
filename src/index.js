// @flow

// babel-preset-react-app uses useBuiltIn "entry". We therefore need an entry
// polyfill import to be replaced with polyfills we need for our targeted browsers.
import '@babel/polyfill';
import * as React from 'react';
import ReactDOM from 'react-dom';
import axe from 'react-axe';
import App from './App';
import './index.css';
import 'leaflet/dist/leaflet.css';
import './App.css';
import './Map.css';
import 'focus-visible';
import focusWithin from 'focus-within';

import registerServiceWorker from './registerServiceWorker';

const a11yAuditActive = false;

if (process.env.NODE_ENV === 'development' && a11yAuditActive) {
  axe(React, ReactDOM, 1000);
}

function startApp() {
  ReactDOM.render(<App />, document.getElementById('root'));
}

if (window.cordova) {
  document.addEventListener('deviceready', startApp, false);
} else {
  startApp();
}

focusWithin(document);

// Don't let the body scroll.
document.body.addEventListener('touchmove', e => e.preventDefault(), false);
document.addEventListener('touchmove', e => e.preventDefault(), false);

registerServiceWorker();
