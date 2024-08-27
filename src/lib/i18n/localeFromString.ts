import upperFirst from 'lodash/upperFirst';
import { Locale } from './Locale';
import { isScript } from './isScript';

export function localeFromString(localeString: string): Locale {
  const lowercaseLocale = localeString.toLowerCase().replace(/_/, '-');
  const [languageCode, countryCodeOrScript] = localeString.split(/[-_]/);
  // Transifex uses `-` to separate subtags if the second subtag is a script, and '_' otherwise
  const transifexLanguageIdentifier = isScript(countryCodeOrScript)
    ? `${languageCode}${
      countryCodeOrScript
        ? `-${upperFirst(countryCodeOrScript.toLowerCase())}`
        : ''
    }`
    : `${languageCode}${
      countryCodeOrScript ? `_${countryCodeOrScript.toUpperCase()}` : ''
    }`;
  return {
    languageCode,
    countryCodeOrScript,
    // e.g. en or en-uk
    string: lowercaseLocale,
    // e.g. en or en_UK
    transifexLanguageIdentifier,
    isEqual(otherLocale) {
      return otherLocale.string === lowercaseLocale;
    },
  };
}
