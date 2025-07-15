import type { TagOrTagGroup } from "~/modules/edit/hooks/useOsmTags";
import { getTagValues } from "~/modules/edit/utils/getTagValues";
import { valueRenderFunctions } from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/valueRenderFunctions";
import type IAccessibilityAttribute from "~/needs-refactoring/lib/model/ac/IAccessibilityAttribute";
import type { AnyFeature } from "~/needs-refactoring/lib/model/geo/AnyFeature";
import { getOSMTagProps } from "~/needs-refactoring/lib/model/osm/tag-config/getOSMTagProps";

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
  tagOrGroup.value = singleValue;
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
