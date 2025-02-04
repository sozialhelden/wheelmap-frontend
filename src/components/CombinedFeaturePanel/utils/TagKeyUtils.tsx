import {languageTaggedKeys} from "~/lib/model/osm/tag-config/languageTaggedKeys";
import {describeIETFLanguageTag} from "@sozialhelden/ietf-language-tags";

/*
* Checks whether an osm tag has language tag support and if a language tag is present.
* Returns the normalized osm tag, a flag and the language tag itself if the input tag is in the list of language tagged osm tags.
* If the input tag is not language tagged the flag is returned as false.
* If the input tag is generally language tagged (in the list of language tags) but no language is appended on this instance,
* the flag is returned as true and the language tag as null.
* @example
* Input: `wheelchair:description:es`, Output: `{ wheelchair:description, true, es }`
* Input: `wheelchair:description`, Output: `{ wheelchair:description, true, null }`
* Input: `an:other:tag`, Output: `{ an:other:tag, false, null }`
*/

export const normalizeAndExtractLanguageTagsIfPresent = (tagName: string) => {
  if (languageTaggedKeys.has(tagName)) {
    return { normalizedTag: tagName, hasLanguageTagSupport: true, languageTag: null };
  }

  const parts: string[] = tagName.split(":");
  let assembledString: string = parts.slice(0, parts.length - 1).join(":");

  for (let i = 1; i < parts.length; i++) {
    if (languageTaggedKeys.has(assembledString)) {
      const languageTag = parts[parts.length - i];
      const isValidTag = describeIETFLanguageTag(languageTag, false) !== "undefined tag"
      if (isValidTag){
        return { normalizedTag: assembledString, hasLanguageTagSupport: true, languageTag };
      }
      else {
        console.warn("Tag ", assembledString, "is appended with an unknown tag.")
        return { normalizedTag: assembledString, hasLanguageTagSupport: true, languageTag: null };
      }
    }
    assembledString = parts.slice(0, parts.length - (1 + i)).join(":");
  }

  return { normalizedTag: tagName, hasLanguageTagSupport: false, languageTag: null };
};


/*
* Returns a set of available lang tags for a list of language tagged osm tags.
* The osm tags must share the same base tag since the extraction of the language tags is based on the length of the
* base tag.
*/
export const getAvailableLangTags = (langTaggedKeys: string[], lengthOfBaseTag: number) => {
  return new Set(
    langTaggedKeys
      .filter((tagKey) => tagKey.split(":").length > lengthOfBaseTag)
      .map((tagKey) => tagKey.split(":").at(-1) || ""),
  );
}
