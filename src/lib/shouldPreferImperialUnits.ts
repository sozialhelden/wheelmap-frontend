import {localeFromString} from "./i18n/localeFromString";

export default function shouldPreferImperialUnits(languageTags): boolean {
  const currentLocale = localeFromString(languageTags[0]);
  if (!currentLocale) return false;
  return (
    currentLocale.languageCode === "en" ||
    ["uk", "us", "ca"].includes(currentLocale.countryCodeOrScript)
  );
}
