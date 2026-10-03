import unfetch from 'isomorphic-unfetch';
import env from './env';

// Requests to the uncached accessibility.cloud backend don't pass the CDN, so they don't need
// `Surrogate-Key` headers. These can grow beyond Node's 16 KB header limit and make `fetch` fail
// with `UND_ERR_HEADERS_OVERFLOW`, so we ask the backend to omit them.
export function withoutSurrogateKeys(url: string): string {
  const uncachedBaseUrl = env.REACT_APP_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL;
  if (!uncachedBaseUrl || !url.startsWith(uncachedBaseUrl)) {
    return url;
  }
  return `${url}${url.includes('?') ? '&' : '?'}surrogateKeys=false`;
}

export default function customFetch(url: string, options: any) {
  url = withoutSurrogateKeys(url);
  options = options || {};
  options.headers = { Accept: 'application/json', ...options.headers };

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
