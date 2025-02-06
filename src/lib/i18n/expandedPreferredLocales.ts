import flatten from "lodash/flatten";
import uniqBy from "lodash/uniqBy";
import type { Locale } from "./Locale";
import { defaultLocale } from "./i18n";
import { nextFallbackLocale } from "./nextFallbackLocale";

export function expandedPreferredLocales(
  locales: Locale[],
  overriddenLocale?: Locale,
): Locale[] {
  const overridden = [overriddenLocale, ...locales, defaultLocale]
    // .map(hardcodedLocaleReplacement)
    .filter(Boolean);
  const overriddenWithCountryCombinations = flatten(
    overridden.map((l) => [l, nextFallbackLocale(l)]),
  );
  // Try all locales without country code, too
  return uniqBy(overriddenWithCountryCombinations, (locale) => locale.string);
}
