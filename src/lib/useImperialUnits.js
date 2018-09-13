import { currentLocales } from './i18n';

export default function useImperialUnits() {
  const currentLocale = currentLocales[0];
  if (!currentLocale) return false;
  return currentLocale === 'en' || Boolean(currentLocale.match(/(UK|US|CA)$/));
}
