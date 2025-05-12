import { getAvailableLangTags } from "~/needs-refactoring/lib/util/TagKeyUtils";

export function selectWheelchairDescription(keys: string[], languageTag) {
  const descriptionKeys = keys.filter((key) =>
    key.startsWith("wheelchair:description"),
  );
  const availableLangTags = getAvailableLangTags(descriptionKeys, 2);
  let matchingLangTag: string | null = "";
  matchingLangTag = availableLangTags.has(languageTag) ? languageTag : null;
  return keys.filter((key: string) => {
    if (!key.startsWith("wheelchair:description")) {
      return true;
    }
    if (matchingLangTag) {
      return key === `wheelchair:description:${matchingLangTag}`;
    }
    return key === "wheelchair:description";
  });
}
