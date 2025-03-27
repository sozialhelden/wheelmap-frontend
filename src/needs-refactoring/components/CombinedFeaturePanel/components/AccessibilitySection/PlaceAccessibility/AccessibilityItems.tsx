import { type FC, useContext } from "react";
import useAccessibilityAttributesIdMap from "~/needs-refactoring/lib/fetchers/ac/useAccessibilityAttributesIdMap";
import type IAccessibilityAttribute from "~/needs-refactoring/lib/model/ac/IAccessibilityAttribute";
import type { AnyFeature } from "~/needs-refactoring/lib/model/geo/AnyFeature";
import { FeaturePanelContext } from "../../../FeaturePanelContext";
import AccessibilityDetailsTree from "./AccessibilityDetailsTree";

export const AccessibilityItems: FC<{ feature: AnyFeature }> = () => {
  const context = useContext(FeaturePanelContext);

  // const result = useFeature(feature?._id)
  const acAccessibility =
    context.features[0]?.feature?.acFeature?.properties.accessibility ?? {};

  const { map } = useAccessibilityAttributesIdMap();

  return (
    <AccessibilityDetailsTree
      accessibilityAttributes={
        map ?? new Map<string, IAccessibilityAttribute>()
      }
      details={acAccessibility}
    />
  );
};
