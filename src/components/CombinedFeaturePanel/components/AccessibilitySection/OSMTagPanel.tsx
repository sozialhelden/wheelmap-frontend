import { get, set, sortBy } from 'lodash';
import * as React from 'react';
import { TypeTaggedOSMFeature } from '../../../../lib/model/geo/AnyFeature';
import isAccessibilityRelevantOSMKey from '../../../../lib/model/osm/isAccessibilityRelevantOSMKey';
import isAddressRelevantOSMKey from '../../../../lib/model/osm/isAddressRelevantOSMKey';
import OSMTagTable from './OSMTagTable';
import {
  omittedKeyPrefixes, omittedKeySuffixes, omittedKeys, pathsToConsumedTagKeys, sortOrderMap,
} from './config';

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
        const parentPath = path.replace(/\.[^.]+$/, '');
        const existingParent = get(result, parentPath);
        const newObject = typeof existingParent === 'string' ? existingParent : key;
        set(result, path, newObject);
        // console.log(`${key} matched ${keyRegExp} -> ${bucketName}, existing:`, existingParent, `new:`, newObject);
        // console.log(`Assigned`, path, '=', newObject);
        // console.log(`Result`, result);
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
    return order === undefined ? 100000 : order;
  });

  return sortedEntries.map(([k, v]) => {
    if (typeof v === 'string') {
      return { key: v };
    }
    return { key: k, children: nest(v) };
  });
}

export function OSMTagPanel({ feature }: { feature: TypeTaggedOSMFeature; }) {
  const nestedTags = React.useMemo(
    () => {
      const filteredKeys = Object.keys(feature.properties)
        .filter((key) => !omittedKeys.has(key))
        .filter((key) => !omittedKeyPrefixes.find((prefix) => key.startsWith(prefix)))
        .filter((key) => !omittedKeySuffixes.find((suffix) => key.endsWith(suffix)));
      const accessibilityRelevantKeys = filteredKeys.filter(
        isAccessibilityRelevantOSMKey,
      );
      const addressRelevantKeys = filteredKeys.filter(isAddressRelevantOSMKey);

      // const remainingKeys = difference(
      //   filteredKeys,
      //   accessibilityRelevantKeys,
      //   addressRelevantKeys
      // );

      const tree = generateTree(accessibilityRelevantKeys);
      const nestedTags = nest(tree);
      return nestedTags;
    },
    [feature],
  );

  return (
    <OSMTagTable
      nestedTags={nestedTags}
      feature={feature}
    />
  );
}
