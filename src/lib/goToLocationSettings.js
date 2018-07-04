import { t } from 'c-3po';
import { userAgent } from '../lib/userAgent';
import { saveState } from './savedState';


// Open location settings or show the user how to open them

export default function goToLocationSettings() {
  saveState({ hasOpenedLocationSettings: true });

  if (window.cordova) {
    if (userAgent.os.name === 'Android') {
      window.cordova.diagnostics.switchToLocationSettings();
    } else if (userAgent.os.name === 'iOS') {
      window.location.href = 'https://support.apple.com/en-us/ht203033';
    }
    return;
  }

  const supportURLs = {
    'Safari': 'https://support.apple.com/en-us/ht204690',
    'Mobile Safari': 'https://support.apple.com/en-us/ht203033',
    'Chrome': 'https://support.google.com/chrome/answer/142065',
    'Firefox': 'https://support.mozilla.org/en-US/kb/does-firefox-share-my-location-websites',
    'Edge': 'http://www.monitorconnect.com/allow-location-tracking-on-microsoft-edge-web-solution-b/',
  }

  const supportURL = supportURLs[userAgent.browser.name];

  if (supportURL) {
    window.location.href = supportURL;
    return;
  }

  window.alert(t`To locate yourself, open browser settings and allow wheelmap.org to use location services.`);
}