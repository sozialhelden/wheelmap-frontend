// @flow

import unfetch from 'isomorphic-unfetch';

import fetchViaCordova from './fetchViaCordova';
import isCordova from './isCordova';

export default function(url: string, options: any) {
  options = options || {};

  // console.log('Fetching', url, '…');

  const start = Date.now();
  function afterEnd(data: any) {
    const end = Date.now();
    const elapsed = end - start;
    if (elapsed > 500) {
      console.warn('… ', url, ' fetched - took', elapsed, 'ms');
    }
    //else {
    //   console.log('…', url, 'fetched - took', elapsed, 'ms');
    //}
    return data;
  }

  // If we're running in a cordova app and it has http, make our lives easier by using native HTTP
  // connections.
  if (isCordova() && options.cordova === true) {
    return fetchViaCordova(url, options).then(afterEnd);
  }

  if (typeof fetch === 'function') {
    // Use browser WhatWG fetch implementation if existing
    return fetch(url, options).then(afterEnd);
  } else {
    // ...otherwise use unfetch polyfill. It doesn't support everything in the WhatWG proposal, but
    // has enough features for this app.
    return unfetch(url, options).then(afterEnd);
  }
}
