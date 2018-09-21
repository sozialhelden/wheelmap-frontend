// @flow

// import Link from 'next/link';

import * as React from 'react';
// import ReactDOM from 'react-dom';
// import axe from 'react-axe';
import App from '../App';

// import registerServiceWorker from './registerServiceWorker';

// const a11yAuditActive = false;

// if (process.env.NODE_ENV === 'development' && a11yAuditActive) {
//   axe(React, ReactDOM, 1000);
// }

// if (isCordova()) {
//   document.addEventListener('deviceready', startApp, false);
// }

// Don't let the body scroll.
// document.body.addEventListener('touchmove', e => e.preventDefault(), false);
// document.addEventListener('touchmove', e => e.preventDefault(), false);

// registerServiceWorker();

export default function Main(props) {
  return (
    <React.Fragment>
      <App {...props} />
    </React.Fragment>
  );
}
