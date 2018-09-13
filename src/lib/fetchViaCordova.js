import clone from 'lodash/clone';
import toPairs from 'lodash/toPairs';
import isCordova from './isCordova';

// This is based on code from the unfetch npm package.

/*!
  The MIT License (MIT)

  Copyright (c) 2017 Jason Miller

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
  associated documentation files (the "Software"), to deal in the Software without restriction,
  including without limitation the rights to use, copy, modify, merge, publish, distribute,
  sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or
  substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
  NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

export default function fetchViaCordova(url, options) {
  if (!isCordova()) {
    throw new Error('This method should only be used inside a cordova app.');
  }

  if (typeof window === 'undefined' || !window.cordova.plugin || !window.cordova.plugin.http) {
    throw new Error(
      'This method works only with the cordova-plugin-advanced-http plugin. You might want to install it using `cordova plugin add cordova-plugin-advanced-http`.'
    );
  }

  return new Promise((resolve, reject) => {
    options = options || {};
    const requestOptions = {
      method: options.method || 'get',
      headers: options.headers || {},
      data: options.body,
      timeout: options.timeout,
    };

    //console.log('Start fetching via Cordova:', url, requestOptions);
    window.cordova.plugin.http.sendRequest(
      url.replace(/ /g, '%20'),
      requestOptions,
      function(response) {
        //console.log('Done fetching via Cordova:', url, requestOptions, response);
        const responseObject = {
          ok: response.status >= 200 && response.status < 300,
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          clone: () => clone(responseObject),
          text: () => Promise.resolve(response.data),
          json: () => Promise.resolve(response.data).then(JSON.parse),
          blob: () => Promise.resolve(new Blob([response.data])),
          headers: {
            keys: () => Object.keys(response.headers),
            entries: () => toPairs(response.headers),
            get: n => response.headers[n.toLowerCase()],
            has: n => n.toLowerCase() in response.headers,
          },
        };
        resolve(responseObject);
      },
      reject
    );
  });
}

// window.fetchViaCordova = fetchViaCordova;
