import { type FC, useContext } from "react";
import { useCurrentLanguageTagStrings } from "../../../../../lib/context/LanguageTagContext";
import useAccessibilityAttributesIdMap from "../../../../../lib/fetchers/ac/useAccessibilityAttributesIdMap";
import type IAccessibilityAttribute from "../../../../../lib/model/ac/IAccessibilityAttribute";
import type { AnyFeature } from "../../../../../lib/model/geo/AnyFeature";
import { FeaturePanelContext } from "../../../FeaturePanelContext";
import AccessibilityDetailsTree from "./AccessibilityDetailsTree";

export const AccessibilityItems: FC<{ feature: AnyFeature }> = () => {
  const context = useContext(FeaturePanelContext);

  // const result = useFeature(feature?._id)
  const acAccessibility =
    context.features[0]?.feature?.acFeature?.properties.accessibility ?? {};

  const languageTags = useCurrentLanguageTagStrings();
  const { map } = useAccessibilityAttributesIdMap(languageTags);
  return (
    <AccessibilityDetailsTree
      accessibilityAttributes={
        map ?? new Map<string, IAccessibilityAttribute>()
      }
      details={acAccessibility}
    />
  );
};
