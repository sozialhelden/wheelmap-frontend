export type Locale = {
  languageCode: string | null;
  countryCodeOrScript: string | null;
  string: string;
  /**
   * In this string, an underscore separates language and country code subtag (e.g. pt_BR)/
   * A dash separates language and script subtag (e.g. zh-Hans)
   */
  transifexLanguageIdentifier: string;
  isEqual: (otherLocale: Locale) => boolean;
};
