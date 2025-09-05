"use client";

import { useContext, useMemo } from "react";
import { CombinedFeaturePanel } from "~/needs-refactoring/components/CombinedFeaturePanel/CombinedFeaturePanel";
import { FeaturePanelContext } from "~/needs-refactoring/components/CombinedFeaturePanel/FeaturePanelContext";

export default function PlacePage() {
  const { features, anyLoading } = useContext(FeaturePanelContext);
  const resolvedFeatures = useMemo(
    () => features.map((x) => x.feature?.requestedFeature).filter((x) => !!x),
    [features],
  );

  return (
    <CombinedFeaturePanel features={resolvedFeatures} isLoading={anyLoading} />
  );
}
