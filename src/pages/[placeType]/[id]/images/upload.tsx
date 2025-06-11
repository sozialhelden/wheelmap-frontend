import { useContext, useMemo } from "react";
import { getLayout } from "~/layouts/FeatureDetailsLayout";
import { CombinedFeaturePanel } from "~/needs-refactoring/components/CombinedFeaturePanel/CombinedFeaturePanel";
import { FeaturePanelContext } from "~/needs-refactoring/components/CombinedFeaturePanel/FeaturePanelContext";

export default function ShowImageUploadPage() {
  const { features } = useContext(FeaturePanelContext);
  const resolvedFeatures = useMemo(
    () =>
      features
        .map(({ feature }) => feature?.requestedFeature)
        .filter((feature) => !!feature),
    [features],
  );

  return (
    <CombinedFeaturePanel features={resolvedFeatures} isUploadDialogOpen />
  );
}

ShowImageUploadPage.getLayout = getLayout;
