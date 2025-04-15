import { get, set, sortBy } from "lodash";
import * as React from "react";
import type { TypeTaggedOSMFeature } from "~/lib/model/geo/AnyFeature";
import { omittedKeyPrefixes } from "~/lib/model/osm/tag-config/omittedKeyPrefixes";
import { omittedKeySuffixes } from "~/lib/model/osm/tag-config/omittedKeySuffixes";
import { omittedKeys } from "~/lib/model/osm/tag-config/omittedKeys";
import { pathsToConsumedTagKeys } from "~/lib/model/osm/tag-config/pathsToConsumedTagKeys";
import { sortOrderMap } from "~/lib/model/osm/tag-config/sortOrderMap";
import {
  getAvailableLangTags,
  normalizeAndExtractLanguageTagsIfPresent,
} from "~/lib/util/TagKeyUtils";
import { useI18nContext } from "~/modules/i18n/context/I18nContext";
import isAccessibilityRelevantOSMKey from "../../../../lib/model/osm/tag-config/isAccessibilityRelevantOSMKey";
import OSMTagTable from "./OSMTagTable";

export interface ITreeNode {
  [key: string]: string | ITreeNode; // type for unknown keys.
}

/**
 * @returns a data structure like this:
 *
 * ```javascript
 * {
 *   wheelchair: "wheelchair"
 *   payment: {
 *   mastercard: { nfc: "payment:mastercard:nfc", chip: "payment:mastercard:chip" }
 *   visa: "payment:visa"
 * }
 * ```
 */

function generateTree(keys: string[]): ITreeNode {
  const result: ITreeNode = {};

  for (const key of keys) {
    for (const [bucketName, keyRegExp] of pathsToConsumedTagKeys) {
      const matches = key.match(keyRegExp);
      if (matches) {
        const path = key.replace(keyRegExp, bucketName);
        const parentPath = path.replace(/\.[^.]+$/, "");
        const existingParent = get(result, parentPath);
        const newObject =
          typeof existingParent === "string" ? existingParent : key;
        set(result, path, newObject);
        // log.log(`${key} matched ${keyRegExp} -> ${bucketName}, existing:`, existingParent, `new:`, newObject);
        // log.log(`Assigned`, path, '=', newObject);
        // log.log(`Result`, result);
        break;
      }
    }
  }
  return result;
}

function nest(tree: ITreeNode) {
  const entries = Object.entries(tree);
  const sortedEntries = sortBy(entries, ([key]) => {
    const { normalizedOSMTagKey } =
      normalizeAndExtractLanguageTagsIfPresent(key);
    const order = sortOrderMap.get(normalizedOSMTagKey);
    return order === undefined ? 100000 : order;
  });

  return sortedEntries.map(([k, v]) => {
    if (typeof v === "string") {
      return { key: v };
    }
    return { key: k, children: nest(v) };
  });
}

export function OSMTagPanel({ feature }: { feature: TypeTaggedOSMFeature }) {
  const { languageTag } = useI18nContext();
  const nestedTags = React.useMemo(() => {
    const filteredKeys = Object.keys(feature.properties || {})
      .filter((key) => !omittedKeys.has(key))
      .filter(
        (key) =>
          !omittedKeyPrefixes.find((prefix) =>
            typeof prefix === "string"
              ? key.startsWith(prefix)
              : key.match(prefix),
          ),
      )
      .filter(
        (key) => !omittedKeySuffixes.find((suffix) => key.endsWith(suffix)),
      );
    const accessibilityRelevantKeys = filteredKeys.filter(
      isAccessibilityRelevantOSMKey,
    );

    // select most suitable language of wheelchair description
    const descriptionKeys = accessibilityRelevantKeys.filter((key) =>
      key.startsWith("wheelchair:description"),
    );
    const availableLangTags = getAvailableLangTags(descriptionKeys, 2);
    let matchingLangTag: string | null = "";
    matchingLangTag = availableLangTags.has(languageTag) ? languageTag : null;
    let finalListOfKeys: string[];
    finalListOfKeys = accessibilityRelevantKeys.filter((key) => {
      if (!key.startsWith("wheelchair:description")) {
        return true;
      }
      if (matchingLangTag) {
        return key === `wheelchair:description:${matchingLangTag}`;
      }
      return key === "wheelchair:description";
    });

    // add a pseudo tag if there is no wheelchair description yet to render an add button
    if (
      !finalListOfKeys.some((item) => item.startsWith("wheelchair:description"))
    ) {
      finalListOfKeys.push("addWheelchairDescription");
    }

    const tree = generateTree(finalListOfKeys);
    return nest(tree);
  }, [feature, languageTag]);

  return <OSMTagTable nestedTags={nestedTags} feature={feature} />;
}
