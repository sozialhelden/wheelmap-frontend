"use client";

import { useContext, useMemo } from "react";
import {
  CombinedFeaturePanel,
  type CombinedFeaturePanelProps,
} from "~/needs-refactoring/components/CombinedFeaturePanel/CombinedFeaturePanel";
import { FeaturePanelContext } from "~/needs-refactoring/components/CombinedFeaturePanel/FeaturePanelContext";

// TODO: this is part of a temporary workaround. please refactor the feature panel context
//  and the CombinedFeaturePanel to use next js server components and data fetching
//  properly
export default function CombinedFeaturePanelWrapper(
  props: Omit<CombinedFeaturePanelProps, "features" | "isLoading">,
) {
  const { features, anyLoading } = useContext(FeaturePanelContext);
  const resolvedFeatures = useMemo(
    () =>
      features
        .map(({ feature }) => feature?.requestedFeature)
        .filter((feature) => !!feature),
    [features],
  );

  return (
    <CombinedFeaturePanel
      features={resolvedFeatures}
      isLoading={anyLoading}
      {...props}
    />
  );
}
