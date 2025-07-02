import { omittedKeys } from "~/needs-refactoring/lib/model/osm/tag-config/omittedKeys";
import { omittedKeyPrefixes } from "~/needs-refactoring/lib/model/osm/tag-config/omittedKeyPrefixes";
import { omittedKeySuffixes } from "~/needs-refactoring/lib/model/osm/tag-config/omittedKeySuffixes";
import isAccessibilityRelevantOSMKey from "~/needs-refactoring/lib/model/osm/tag-config/isAccessibilityRelevantOSMKey";

export function filterKeys(feature) {
  return Object.keys(feature.properties || {})
    .filter((key) => !omittedKeys.has(key))
    .filter(
      (key) =>
        !omittedKeyPrefixes.find((prefix) =>
          typeof prefix === "string"
            ? key.startsWith(prefix)
            : key.match(prefix),
        ),
    )
    .filter((key) => !omittedKeySuffixes.find((suffix) => key.endsWith(suffix)))
    .filter((key) => isAccessibilityRelevantOSMKey(key));
}
