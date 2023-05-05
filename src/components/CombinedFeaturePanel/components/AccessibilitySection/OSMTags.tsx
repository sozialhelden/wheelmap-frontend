import * as React from "react";
import { isOSMFeature, TypeTaggedOSMFeature } from "../../../../lib/model/shared/AnyFeature";
import isAccessibilityRelevantOSMKey from "../../../../lib/model/osm/isAccessibilityRelevantOSMKey";
import isAddressRelevantOSMKey from "../../../../lib/model/osm/isAddressRelevantOSMKey";
import OSMTagTable from "./OSMTagTable";
import { difference, sortBy } from "lodash";

const sortOrderMap = new Map<string, number>([
  ['name', 0 ],
  ['wheelchair', 1 ],
  ['wheelchair:description', 2 ],
  ['wheelchair:toilets', 3 ],
  ['toilets:wheelchair', 4 ],
  ['toilets', 5],
]);

export function OSMTags({ feature }: { feature: TypeTaggedOSMFeature; }) {
  if (!isOSMFeature(feature)) {
    return null;
  }
  const sortedKeys = sortBy(Object.keys(feature.properties).sort(), (key) => {
    const order = sortOrderMap.get(key);
    return order === undefined ? Infinity : order;
  });
  const omittedKeyPrefixes = ["type", "name", "area", "opening_hours:signed"];
  const filteredKeys = sortedKeys.filter(
    (key) => !omittedKeyPrefixes.find((prefix) => key.startsWith(prefix))
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

  return <OSMTagTable keys={accessibilityRelevantKeys} feature={feature} />;
}
