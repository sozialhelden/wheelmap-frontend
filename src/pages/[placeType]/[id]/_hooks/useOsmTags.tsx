import * as React from "react";
import { useContext } from "react";
import { useI18nContext } from "~/modules/i18n/context/I18nContext";
import { FeaturePanelContext } from "~/needs-refactoring/components/CombinedFeaturePanel/FeaturePanelContext";
import type { OSMTagProps } from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/OSMTagProps";
import useAccessibilityAttributesIdMap from "~/needs-refactoring/lib/fetchers/ac/useAccessibilityAttributesIdMap";
import { isOSMFeature } from "~/needs-refactoring/lib/model/geo/AnyFeature";
import { attachTagPropsRecursively } from "~/pages/[placeType]/[id]/_utils/attachPropsRecursively";
import { filterKeys } from "~/pages/[placeType]/[id]/_utils/filterKeys";
import { generateTree } from "~/pages/[placeType]/[id]/_utils/generateTree";
import { nestTree } from "~/pages/[placeType]/[id]/_utils/nestTree";
import { selectWheelchairDescription } from "~/pages/[placeType]/[id]/_utils/selectWheelchairDescription";

export type TagOrTagGroup = {
  key: string;
  value?: string | number;
  children: TagOrTagGroup[];
  tagProps?: OSMTagProps;
};

export function useOsmTags(feature: unknown) {
  const osmFeature = isOSMFeature(feature) ? feature : null;

  const { languageTag } = useI18nContext();
  const { baseFeatureUrl } = useContext(FeaturePanelContext);
  const { map: attributesById } = useAccessibilityAttributesIdMap();

  const nestedTags: TagOrTagGroup[] = React.useMemo(() => {
    if (!osmFeature) {
      return [];
    }
    const filteredKeys = filterKeys(osmFeature);
    const finalKeys = selectWheelchairDescription(filteredKeys, languageTag);
    const tree = generateTree(finalKeys);
    return nestTree(tree);
  }, [osmFeature, languageTag]);

  if (osmFeature) {
    for (const tagOrGroup of nestedTags) {
      attachTagPropsRecursively(
        tagOrGroup,
        osmFeature,
        attributesById,
        baseFeatureUrl,
      );
    }
  }

  const topLevelKeys = new Set(
    osmFeature ? nestedTags.map(({ key }) => key) : [],
  );

  return { nestedTags, topLevelKeys };
}
