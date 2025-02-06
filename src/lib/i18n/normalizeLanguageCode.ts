/**
 * Currently, we support `zh-Hans` (Chinese Simplified) and zh-Hant (Chinese Traditional) language
 * codes. This function returns the right script variant for the given language tag if it contains
 * a region code.
 */

export function normalizeLanguageCode(languageTag: string): string {
  const [languageCode, countryCodeOrScript] = languageTag.split(/[-_]/);
  // Hardwire old-style chinese locale codes to new-style script subtags
  if (languageCode === "zh") {
    if (!countryCodeOrScript) {
      // The string contains no country code or script -
      // 90% of our readers will prefer Simplified Chinese so we fall back to it
      return "zh-Hans";
    }
    if (!["Hans", "Hant"].includes(countryCodeOrScript)) {
      switch (countryCodeOrScript) {
        // Countries using Simplified script
        case "CN": // Mainland China
        case "SG": // Singapure
        case "MY": // Malaysia
          return "zh-Hans";
        default:
          // overseas Chinese uses Traditional script in most cases
          return "zh-Hant";
      }
    }
  }

  if (languageTag === "en") {
    // we have no British translation yet. Prefer `en-US`.
    return "en-US";
  }
  return languageTag;
}
