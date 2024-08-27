import compact from 'lodash/compact';
import { normalizeLanguageCode } from './normalizeLanguageCode';

export function findMostUsableLanguageTag(
  availableLanguageTags: string[],
  requestedLanguageTag?: string,
) {
  if (availableLanguageTags.length === 0) {
    return undefined;
  }
  const sanitizedRequestedLanguageTag = requestedLanguageTag
    && normalizeLanguageCode(requestedLanguageTag).replace('-', '_');
  const firstAvailableLocale = availableLanguageTags[0];
  const tagWithoutRegion = sanitizedRequestedLanguageTag && sanitizedRequestedLanguageTag.slice(0, 2);
  const languageTagsToTry = compact([
    sanitizedRequestedLanguageTag,
    tagWithoutRegion,
    'en_US',
    'en',
    firstAvailableLocale,
  ]);
  const foundLanguageTag = compact(languageTagsToTry).find((tag) => availableLanguageTags.includes(tag));
  return foundLanguageTag;
}
