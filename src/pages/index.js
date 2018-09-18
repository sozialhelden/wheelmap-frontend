// @flow

// import Link from 'next/link';

import * as React from 'react';
// import ReactDOM from 'react-dom';
// import axe from 'react-axe';
import App from '../App';
import Head from 'next/head';

// import 'wicg-focus-ring';

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

export default function Index(props: Props) {
  return (
    <React.Fragment>
      <Head>
        <title>Wheelmap</title>
      </Head>
      <App {...props} />
    </React.Fragment>
  );
}
