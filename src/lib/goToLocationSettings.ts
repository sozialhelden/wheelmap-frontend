import { t } from 'ttag';
import {
  getUserAgentString,
  parseUserAgentString,
} from './context/UserAgentContext';
import { saveState } from './util/savedState';

// Open location settings or show the user how to open them

export default function goToLocationSettings() {
  saveState({ hasOpenedLocationHelp: 'true' });

  const userAgent = parseUserAgentString(getUserAgentString());

  // @ts-ignore
  let identity = userAgent.browser.name;
  if (userAgent.os.name === 'iOS') {
    identity = 'iOS';
  } else if (userAgent.os.name === 'Android') {
    identity = 'Android';
  }

  const supportURLs = {
    Safari: 'https://support.apple.com/en-us/ht204690',
    'Mobile Safari': 'https://support.apple.com/en-us/ht203033',
    iOS: 'https://support.apple.com/en-us/ht203033',
    Android: 'https://support.google.com/android/answer/6179507',
    Chrome: 'https://support.google.com/chrome/answer/142065',
    Firefox:
      'https://support.mozilla.org/en-US/kb/does-firefox-share-my-location-websites',
    Edge:
      'http://www.monitorconnect.com/allow-location-tracking-on-microsoft-edge-web-solution-b/',
  };

  const supportURL = supportURLs[identity];
  if (supportURL) {
    window.open(supportURL, '_blank');
    return;
  }

  window.alert(
    t`To locate yourself on the map, open browser settings and allow Wheelmap.org to use location services.`,
  );
}
