import * as React from 'react';
import ReactDOM from 'react-dom';
import axe from 'react-axe';
import App from './App';
import './index.css';
import 'leaflet/dist/leaflet.css';
import './App.css';
import './Map.css';
import 'leaflet.locatecontrol/src/L.Control.Locate.scss';
import 'wicg-focus-ring'

import registerServiceWorker from './registerServiceWorker';

if (process.env.NODE_ENV === 'development') {
  axe(React, ReactDOM, 1000);
}

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);

registerServiceWorker();
