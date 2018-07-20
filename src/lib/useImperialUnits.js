import { currentLocales } from './i18n';

export default function useImperialUnits() {
  return currentLocales[0] === 'en' || Boolean(currentLocales[0].match(/(UK|US)$/));
}
