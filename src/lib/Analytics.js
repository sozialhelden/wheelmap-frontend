// @flow

import ReactGA from 'react-ga';
import { setAnalyticsAllowed, hasAllowedAnalytics } from './savedState';

export function restoreAnalytics(trackingId: string) {
  if (hasAllowedAnalytics()) {
    enableAnalytics(trackingId);
  }
}

export function enableAnalytics(trackingId: string) {
  delete window[`ga-disable-${trackingId}`];
  setAnalyticsAllowed(true);
  ReactGA.initialize(trackingId);
}

function deleteCookie(name: string) {
  const host = window.location.hostname;
  document.cookie = `${name}=; Path=${window.location.pathname ||
    '/'}; Domain=${host}; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}

export function disableAnalytics(trackingId: string) {
  window[`ga-disable-${trackingId}`] = true;
  deleteCookie('_ga');
  deleteCookie('_gid');
  deleteCookie('_gat');
  setAnalyticsAllowed(false);
  // otherwise reinitializing does not set cookies again
  delete window.ga;
}

let lastPath: string = '/';

export function trackPageView(path: string) {
  // if disableAnalytics was called, no need to do anything
  if (typeof window !== 'undefined' && window.ga) {
    ReactGA.pageview(path);
    lastPath = path;
  }
}

export function trackModalView(name: string | null) {
  // if disableAnalytics was called, no need to do anything
  if (typeof window !== 'undefined' && window.ga) {
    if (name) {
      ReactGA.modalview(name);
    } else {
      // track closing of modal dialogs
      ReactGA.pageview(lastPath);
    }
  }
}

export function trackEvent(options: {
  category: string,
  action: string,
  label?: string,
  value?: number,
  nonInteraction?: boolean,
}) {
  // if disableAnalytics was called, no need to do anything
  if (typeof window !== 'undefined' && window.ga) {
    ReactGA.event(options);
  }
}
