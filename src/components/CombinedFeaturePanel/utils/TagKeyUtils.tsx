import { languageTaggedKeys } from "~/lib/model/osm/tag-config/languageTaggedKeys";

export const removeLanguageTagsIfPresent = (inputString: string) => {
  const parts: string[] = inputString.split(":");
  let assembledString: string = parts.slice(0, parts.length - 1).join(":");
  console.log(assembledString);
  for (let i = 1; i < parts.length; i++) {
    if (languageTaggedKeys.has(assembledString)) {
      return assembledString;
    }
    assembledString = parts.slice(0, parts.length - (1 + i)).join(":");
  }
  return inputString;
};
