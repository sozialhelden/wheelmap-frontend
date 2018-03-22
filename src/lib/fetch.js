import fetchViaCordova from './fetchViaCordova';
import unfetch from 'unfetch';

export default function(...args) {
	// If we're running in a cordova app and it has http, make our lives easier by using native HTTP
	// connections.
	if (window.cordova) {
		return fetchViaCordova(...args);
	}

	if (typeof fetch === 'function') {
		// Use browser WhatWG fetch implementation if existing
		return fetch(...args);
	} else {
		// ...otherwise use unfetch polyfill. It doesn't support everything in the WhatWG proposal, but
		// has enough features for this app.
		return unfetch(...args);
	}
}
