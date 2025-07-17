import * as React from "react";
import { useContext } from "react";
import { attachTagPropsRecursively } from "~/modules/edit/utils/attachPropsRecursively";
import { filterKeys } from "~/modules/edit/utils/filterKeys";
import { generateTree } from "~/modules/edit/utils/generateTree";
import { nestTree } from "~/modules/edit/utils/nestTree";
import { selectWheelchairDescription } from "~/modules/edit/utils/selectWheelchairDescription";
import { useI18n } from "~/modules/i18n/context/I18nContext";
import { FeaturePanelContext } from "~/needs-refactoring/components/CombinedFeaturePanel/FeaturePanelContext";
import type { OSMTagProps } from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/OSMTagProps";
import useAccessibilityAttributesIdMap from "~/needs-refactoring/lib/fetchers/ac/useAccessibilityAttributesIdMap";
import { isOSMFeature } from "~/needs-refactoring/lib/model/geo/AnyFeature";

export type TagOrTagGroup = {
  key: string;
  value?: string | number;
  children: TagOrTagGroup[];
  tagProps?: OSMTagProps;
};

export function useOsmTags(feature: unknown) {
  const osmFeature = isOSMFeature(feature) ? feature : null;

  const { languageTag } = useI18n();
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
