import unfetch from 'isomorphic-unfetch';

export default function(url: string, options: any) {
  options = options || {};

  console.log('Fetching', url, '…');

  const start = Date.now();
  function afterEnd(data: any) {
    const end = Date.now();
    const elapsed = end - start;
    if (elapsed > 500) {
      console.warn('… ', url, ' fetched - took', elapsed, 'ms');
    } else {
      console.log('…', url, 'fetched - took', elapsed, 'ms');
    }
    return data;
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
