import { languageTaggedKeys } from "~/lib/model/osm/tag-config/languageTaggedKeys";

/*
* Checks whether an osm tag is generally language tagged and if a language tag is present.
* Returns the normalized osm tag, a flag and the language tag itself if the input tag is in the list of language tagged osm tags.
* If the input tag is not language tagged the flag is returned as false.
* If the input tag is generally language tagged (in the list of language tags) but no language is appended on this instance,
* the flag is returned as true and the language tag as null.
*/

export const normalizeAndExtractLanguageTagsIfPresent = (inputString: string) => {
  if (languageTaggedKeys.has(inputString)) {
    return { normalizedTag: inputString, isLanguageTagged: true, languageTag: null };
  }

  const parts: string[] = inputString.split(":");
  let assembledString: string = parts.slice(0, parts.length - 1).join(":");

  for (let i = 1; i < parts.length; i++) {
    if (languageTaggedKeys.has(assembledString)) {
      const languageTag = parts[parts.length - i];
      return { normalizedTag: assembledString, isLanguageTagged: true, languageTag };
    }
    assembledString = parts.slice(0, parts.length - (1 + i)).join(":");
  }

  return { normalizedTag: inputString, isLanguageTagged: false, languageTag: null };
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
