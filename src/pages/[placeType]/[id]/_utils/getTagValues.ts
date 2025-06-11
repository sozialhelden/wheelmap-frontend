import type { TypeTaggedOSMFeature } from "~/needs-refactoring/lib/model/geo/AnyFeature";
import { tagsWithSemicolonSupport } from "~/needs-refactoring/lib/model/osm/tag-config/tagsWithSemicolonSupport";

export function getTagValues(feature: TypeTaggedOSMFeature, key: string) {
  const originalOSMTagValue = feature.properties[key] ?? "";
  let tagValues: (string | number)[] = [];
  if (
    tagsWithSemicolonSupport.includes(key) &&
    typeof originalOSMTagValue === "string"
  ) {
    tagValues = originalOSMTagValue?.split(";") || [];
  } else {
    tagValues = [originalOSMTagValue];
  }
  return tagValues;
}
