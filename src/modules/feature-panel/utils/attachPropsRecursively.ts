import { getTagValues } from "~/modules/feature-panel/utils/getTagValues";
import { valueRenderFunctions } from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/valueRenderFunctions";
import { getOSMTagProps } from "~/needs-refactoring/lib/model/osm/tag-config/getOSMTagProps";
import type { TagOrTagGroup } from "~/modules/feature-panel/hooks/useOsmTags";
import type { AnyFeature } from "~/needs-refactoring/lib/model/geo/AnyFeature";
import type IAccessibilityAttribute from "~/needs-refactoring/lib/model/ac/IAccessibilityAttribute";

export function attachTagPropsRecursively(
  tagOrGroup: TagOrTagGroup,
  feature: AnyFeature,
  attributesById: Map<string, IAccessibilityAttribute> | undefined,
  baseFeatureUrl: string,
) {
  const { key, children } = tagOrGroup;
  const tagValues = getTagValues(feature, key);
  const singleValue = tagValues[0];
  const matchedKey = Object.keys(valueRenderFunctions).find(
    (renderFunctionKey) => key.match(renderFunctionKey),
  );
  tagOrGroup.tagProps = getOSMTagProps({
    key,
    matchedKey,
    singleValue,
    attributesById,
    feature,
    baseFeatureUrl,
  });
  tagOrGroup.children?.map((child) =>
    attachTagPropsRecursively(child, feature, attributesById, baseFeatureUrl),
  );
}
