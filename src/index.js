import * as React from 'react';
import ReactDOM from 'react-dom';
import a11y from 'react-a11y';
import App from './App';
import './index.css';
import 'leaflet/dist/leaflet.css';
import './App.css';
import './Map.css';
import 'leaflet.locatecontrol/src/L.Control.Locate.scss';
import 'wicg-focus-ring'

import registerServiceWorker from './registerServiceWorker';

if (process.env.NODE_ENV === 'development') {
  const options = {
    ReactDOM: ReactDOM,
    filterFn: name => {
      // ignore a11y checks on components. e.g. if the component that breaks a rule is not under our control
      const ignoreList = ["ShareButton"];
      const nameInIgnoreList = ignoreList.indexOf(name) !== -1
      return !nameInIgnoreList;
    }
  }

  a11y(React, options);
}

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);

registerServiceWorker();
