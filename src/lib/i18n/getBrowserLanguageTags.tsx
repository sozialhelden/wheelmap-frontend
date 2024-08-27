import { compact } from 'lodash';

export function getBrowserLanguageTags(): string[] {
  // Filter empty or undefined locales. Android 4.4 seems to have an undefined
  // window.navigator.language in WebView.
  const languagesCustomizedInBrowser = compact(window.navigator.languages);
  const deviceLanguage = window.navigator.language;

  if (languagesCustomizedInBrowser.length > 0) {
    return languagesCustomizedInBrowser;
  }
  return [deviceLanguage];
}
