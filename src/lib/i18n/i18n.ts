import { Locale } from "./Locale";
import { localeFromString } from "./localeFromString";

const systemLocale = navigator.language || "de-De";
export const currentLocales: Locale[] = [systemLocale, systemLocale.split('-')[0]].map(localeFromString);
