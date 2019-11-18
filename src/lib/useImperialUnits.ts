import { currentLocales } from './i18n';

export default function useImperialUnits(): boolean {
  const currentLocale = currentLocales[0];
  if (!currentLocale) return false;
  return (
    currentLocale.languageCode === 'en' ||
    ['uk', 'us', 'ca'].includes(currentLocale.countryCodeOrScript)
  );
}
