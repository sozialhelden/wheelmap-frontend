import { languageTaggedKeys } from "~/lib/model/osm/tag-config/languageTaggedKeys";

export const removeLanguageTagsIfPresent = (inputString: string) => {
  //TODO: re-implement this using regex
  if (languageTaggedKeys.has(inputString)) {
    return inputString;
  }
  const parts: string[] = inputString.split(":");
  let assembledString: string = parts.slice(0, parts.length - 1).join(":");
  console.log("start string: ", assembledString);
  for (let i = 1; i < parts.length; i++) {
    if (languageTaggedKeys.has(assembledString)) {
      return assembledString;
    }
    assembledString = parts.slice(0, parts.length - (1 + i)).join(":");
  }
  console.log("Tag is not language-tagged. Returning original input string.");
  return inputString;
};

export const extractLanguageTagIfPresent = (inputString: string) => {
  //TODO: implement this using regex
  return "";
};
