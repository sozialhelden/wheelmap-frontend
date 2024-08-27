import { Locale } from './Locale';
import { localeFromString } from './localeFromString';

// Returns a fallback locale for the given locale. Might use a language code without country code
// etc. removed (for example "en" if given "en-GB"). This is preliminary, a 'real' mechanism should
// use a more complex locale matching approach.
//
// If you want to implement this, be careful. In Sebastian's tests, neither Unicode's two proposed
// matching algorithms from TR-35 nor IETF language tag matching have worked as intended with
// locales like `zh-Hans` across all platforms -- talk to Sebastian about this :)
//
// Go has an implementation that seems to do the trick and solves many issues with aforementioned
// specs/proposals: https://blog.golang.org/matchlang
//
// Maybe we can implement this algorithm as a library using WebAssembly.

export function nextFallbackLocale(locale: Locale): Locale {
  return localeFromString(locale.string.substring(0, 2));
}
