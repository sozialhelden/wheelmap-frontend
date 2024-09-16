import { parseLanguageTag } from "@sozialhelden/ietf-language-tags";
import { log } from "../../../../lib/util/logger";

/**
 * Determines if the zeroth level is skipped in the current context. This is because in some
 * countries, tagging floors above ground level starts at 1 instead of 0.
 */
export function determineIfZerothLevelIsSkippedHere(languageTags: string[]) {
  // https://wiki.openstreetmap.org/wiki/Key:level#Level_designations
  const firstLanguageTag = languageTags[0];

  // skip 0 in Kazakhstan, Korea and Mongolia (see wiki article)
  const languageTag = parseLanguageTag(
    firstLanguageTag,
    // Set to `true` for returning `undefined` for invalid tags,
    // outputting errors to the log.
    // Set to `false` to throw an error if a given tag is invalid.
    // The library tries to give helpful feedback for typical errors in tags.
    true,
    // Allows you to use your own logging function. Supply `null` to suppress console output.
    log.log
  );
  const assumeZeroSkippingCountryByLanguage = ['kk', 'kaz', 'ko', 'kor', 'mn', 'mon'].includes(languageTag.language);
  const assumeZeroSkippingCountryByRegion = ['KZ', 'KR', 'MN'].includes(languageTag.region);
  const skipZerothLevel = assumeZeroSkippingCountryByLanguage || assumeZeroSkippingCountryByRegion;
  return skipZerothLevel;
}
