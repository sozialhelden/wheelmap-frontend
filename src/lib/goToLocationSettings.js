import { t } from 'ttag';
import isCordova from './isCordova';
import { userAgent } from '../lib/userAgent';
import { saveState } from './savedState';

// Open location settings or show the user how to open them

export default function goToLocationSettings() {
  saveState({ hasOpenedLocationHelp: 'true' });

  if (isCordova()) {
    if (
      userAgent.os.name === 'Android' &&
      typeof window !== 'undefined' &&
      window.cordova &&
      window.cordova.diagnostics &&
      typeof window.cordova.diagnostics.switchToLocationSettings === 'function'
    ) {
      window.cordova.diagnostics.switchToLocationSettings();
    } else if (userAgent.os.name === 'iOS') {
      window.location.href = 'https://support.apple.com/en-us/ht203033';
    }
    return;
  }

  const supportURLs = {
    Safari: 'https://support.apple.com/en-us/ht204690',
    'Mobile Safari': 'https://support.apple.com/en-us/ht203033',
    Chrome: 'https://support.google.com/chrome/answer/142065',
    Firefox: 'https://support.mozilla.org/en-US/kb/does-firefox-share-my-location-websites',
    Edge: 'http://www.monitorconnect.com/allow-location-tracking-on-microsoft-edge-web-solution-b/',
  };

  const supportURL = supportURLs[userAgent.browser.name];

  if (supportURL) {
    window.open(supportURL, '_blank');
    return;
  }

  window.alert(
    t`To locate yourself on the map, open browser settings and allow Wheelmap.org to use location services.`
  );
}
