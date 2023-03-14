import * as React from "react";
import { isOSMFeature, TypeTaggedOSMFeature } from "../../../../lib/model/shared/AnyFeature";
import isAccessibilityRelevantOSMKey from "../../../../lib/model/osm/isAccessibilityRelevantOSMKey";
import isAddressRelevantOSMKey from "../../../../lib/model/osm/isAddressRelevantOSMKey";
import OSMTagTable from "./OSMTagTable";
import { difference } from "lodash";

export function OSMTags({ feature }: { feature: TypeTaggedOSMFeature; }) {
  if (!isOSMFeature(feature)) {
    return null;
  }
  const sortedKeys = Object.keys(feature.properties)
    .sort()
    .sort((a, b) => {
      if (a.startsWith("name"))
        return -1;
      if (b.startsWith("name"))
        return 1;
      return 0;
    });
  const omittedKeyPrefixes = ["type", "name", "area"];
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
