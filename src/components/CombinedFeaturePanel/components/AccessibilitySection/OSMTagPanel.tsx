import { omittedKeyPrefixes, pathsToConsumedTagKeys, sortOrderMap } from "./config";
import * as React from "react";
import { isOSMFeature, TypeTaggedOSMFeature } from "../../../../lib/model/shared/AnyFeature";
import isAccessibilityRelevantOSMKey from "../../../../lib/model/osm/isAccessibilityRelevantOSMKey";
import isAddressRelevantOSMKey from "../../../../lib/model/osm/isAddressRelevantOSMKey";
import OSMTagTable, { TagOrTagGroup } from "./OSMTagTable";
import { difference, get, groupBy, set, sortBy } from "lodash";


export interface ITreeNode {
  [key: string]: string | ITreeNode // type for unknown keys.
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
  const tested = [];
  for (const key of keys) {
    for (const [bucketName, keyRegExp] of pathsToConsumedTagKeys) {
      const matches = key.match(keyRegExp);
      if (matches) {
        const path = key.replace(keyRegExp, bucketName);
        tested.push(`${key} matched ${keyRegExp} -> ${bucketName} / ${path}`);
        set(result, path, get(result, path) || key);
        break;
      }
    }
  }
  return result;
}


function nest(tree: ITreeNode) {
  const entries = Object.entries(tree);
  const sortedEntries = sortBy(entries, ([key]) => {
    const order = sortOrderMap.get(key);
    return order === undefined ? Infinity : order;
  });

  return sortedEntries.map(([k, v]) => {
    if (typeof v === 'string') {
      return { key: v };
    }
    return { key: k, children: nest(v) }
  });
}


export function OSMTagPanel({ feature }: { feature: TypeTaggedOSMFeature; }) {
  if (!isOSMFeature(feature)) {
    return null;
  }
  const filteredKeys = React.useMemo(
    () => Object.keys(feature.properties).filter(
      (key) => !omittedKeyPrefixes.find((prefix) => key.startsWith(prefix))
    ),
    [feature],
  );
  const accessibilityRelevantKeys = filteredKeys.filter(
    isAccessibilityRelevantOSMKey
  );
  const addressRelevantKeys = filteredKeys.filter(isAddressRelevantOSMKey);

  const remainingKeys = difference(
    filteredKeys,
    accessibilityRelevantKeys,
    addressRelevantKeys
  );

  const nestedTags = React.useMemo(() => nest(generateTree(accessibilityRelevantKeys)), [accessibilityRelevantKeys.join(',')]);

  return <OSMTagTable
    nestedTags={nestedTags} feature={feature}
  />;
}
