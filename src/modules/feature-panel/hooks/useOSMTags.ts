import * as React from "react";
import { getAvailableLangTags } from "~/needs-refactoring/lib/util/TagKeyUtils";
import type { TypeTaggedOSMFeature } from "~/needs-refactoring/lib/model/geo/AnyFeature";
import { omittedKeyPrefixes } from "~/needs-refactoring/lib/model/osm/tag-config/omittedKeyPrefixes";
import { omittedKeySuffixes } from "~/needs-refactoring/lib/model/osm/tag-config/omittedKeySuffixes";
import { omittedKeys } from "~/needs-refactoring/lib/model/osm/tag-config/omittedKeys";
import isAccessibilityRelevantOSMKey from "~/needs-refactoring/lib/model/osm/tag-config/isAccessibilityRelevantOSMKey";
import { useI18nContext } from "~/modules/i18n/context/I18nContext";

export function useOSMTags(feature: TypeTaggedOSMFeature) {
  const { languageTag } = useI18nContext();

  return React.useMemo(() => {
    const tags = Object.fromEntries(
      Object.entries(feature.properties)
        .filter(([key]) => !omittedKeys.has(key))
        .filter(
          ([key]) =>
            !omittedKeyPrefixes.find((prefix) =>
              typeof prefix === "string"
                ? key.startsWith(prefix)
                : key.match(prefix),
            ),
        )
        .filter(
          ([key]) => !omittedKeySuffixes.find((suffix) => key.endsWith(suffix)),
        )
        .filter(([key]) => isAccessibilityRelevantOSMKey(key)),
    );

    // select most suitable language of wheelchair description
    const descriptionKeys = Object.keys(tags).filter((key) =>
      key.startsWith("wheelchair:description"),
    );

    const availableLangTags = getAvailableLangTags(descriptionKeys, 2);
    let matchingLangTag: string | null = "";
    matchingLangTag = availableLangTags.has(languageTag) ? languageTag : null;

    return Object.fromEntries(
      Object.entries(tags).filter(([key]) => {
        if (!key.startsWith("wheelchair:description")) {
          return true;
        }
        if (matchingLangTag) {
          return key === `wheelchair:description:${matchingLangTag}`;
        }
        return key === "wheelchair:description";
      }),
    );
  }, [feature, languageTag]);
}
