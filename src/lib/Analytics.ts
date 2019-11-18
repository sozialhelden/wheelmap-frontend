import ReactGA from 'react-ga';
import { setThirdPartyAnalyticsAllowed, hasAllowedAnalytics } from './savedState';

export function restoreAnalytics(trackingId: string) {
  if (hasAllowedAnalytics()) {
    enableAnalytics(trackingId);
  }
}

export function enableAnalytics(trackingId: string) {
  delete window[`ga-disable-${trackingId}`];
  setThirdPartyAnalyticsAllowed(true);
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
  setThirdPartyAnalyticsAllowed(false);
  // otherwise reinitializing does not set cookies again
  delete window['ga'];
}

let lastPath: string = '/';
let lastModalName: string = '';

export function trackPageView(path: string) {
  if (typeof window === 'undefined') {
    // Don't track anything when running on server
    return;
  }

  // if disableAnalytics was called, no need to do anything
  if (window['ga']) {
    ReactGA.pageview(path);
    lastPath = path;
  }
  // Matomo
  if (typeof window['_paq'] !== 'undefined') {
    window['_paq'].push(['setDocumentTitle', window.document.title]);
    window['_paq'].push(['trackPageView']);
  }
}

export function trackModalView(name: string | null) {
  if (typeof window === 'undefined') {
    // Don't track anything when running on server
    return;
  }

  // if disableAnalytics was called, no need to do anything
  if (window['ga']) {
    if (name) {
      ReactGA.modalview(name);
    } else {
      // track closing of modal dialogs
      ReactGA.pageview(lastPath);
    }
  }
  lastModalName = name || '';
  // Matomo
  if (typeof window['_paq'] !== 'undefined') {
    window['_paq'].push([
      'trackEvent',
      name ? 'ModalOpen' : 'ModalClose',
      name ? String(name) : String(lastModalName),
    ]);
  }
}

export function trackEvent(options: {
  category: string,
  action: string,
  label?: string,
  value?: number,
  nonInteraction?: boolean,
}) {
  if (typeof window === 'undefined') {
    // Don't track anything when running on server
    return;
  }

  // if disableAnalytics was called, no need to do anything
  if (window['ga']) {
    ReactGA.event(options);
  }

  // Matomo
  if (typeof window['_paq'] !== 'undefined') {
    window['_paq'].push([
      'trackEvent',
      options.category,
      options.action,
      options.label,
      options.value,
    ]);
  }
}
