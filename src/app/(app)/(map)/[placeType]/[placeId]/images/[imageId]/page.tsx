"use client";

import { useRouter } from "next/router";
import { useContext, useMemo } from "react";
import { CombinedFeaturePanel } from "~/needs-refactoring/components/CombinedFeaturePanel/CombinedFeaturePanel";
import { FeaturePanelContext } from "~/needs-refactoring/components/CombinedFeaturePanel/FeaturePanelContext";

export default function ShowImagePage({
  params: { imageId },
}: { params: { imageId: string } }) {
  const { features } = useContext(FeaturePanelContext);
  const resolvedFeatures = useMemo(
    () =>
      features
        .map(({ feature }) => feature?.requestedFeature)
        .filter((feature) => !!feature),
    [features],
  );

  const id = typeof imageId === "string" ? imageId : imageId[0];
  return (
    <CombinedFeaturePanel features={resolvedFeatures} activeImageId={id} />
  );
}
