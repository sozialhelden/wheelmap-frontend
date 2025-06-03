import { useI18nContext } from "~/modules/i18n/context/I18nContext";
import * as React from "react";
import { useContext } from "react";
import { FeaturePanelContext } from "~/needs-refactoring/components/CombinedFeaturePanel/FeaturePanelContext";
import useAccessibilityAttributesIdMap from "~/needs-refactoring/lib/fetchers/ac/useAccessibilityAttributesIdMap";
import type { OSMTagProps } from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/OSMTagProps";
import { generateTree } from "~/modules/feature-panel/utils/generateTree";
import { nestTree } from "~/modules/feature-panel/utils/nestTree";
import { selectWheelchairDescription } from "~/modules/feature-panel/utils/selectWheelchairDescription";
import { attachTagPropsRecursively } from "~/modules/feature-panel/utils/attachPropsRecursively";
import { filterKeys } from "~/modules/feature-panel/utils/filterKeys";
import { isOSMFeature } from "~/needs-refactoring/lib/model/geo/AnyFeature";

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
