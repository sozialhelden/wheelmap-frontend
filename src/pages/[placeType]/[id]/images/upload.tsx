import { useRouter } from "next/router";
import { useContext, useMemo } from "react";
import { CombinedFeaturePanel } from "~/components/CombinedFeaturePanel/CombinedFeaturePanel";
import { FeaturePanelContext } from "~/components/CombinedFeaturePanel/FeaturePanelContext";
import { getLayout } from "~/components/CombinedFeaturePanel/PlaceLayout";

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
