import { useContext, useMemo } from "react";
import { CombinedFeaturePanel } from "~/needs-refactoring/components/CombinedFeaturePanel/CombinedFeaturePanel";
import { FeaturePanelContext } from "~/needs-refactoring/components/CombinedFeaturePanel/FeaturePanelContext";
import { getLayout } from "~/components/layouts/PlaceDetailsLayout";

export default function PlaceDetailPage() {
  const { features } = useContext(FeaturePanelContext);
  const resolvedFeatures = useMemo(
    () => features.map((x) => x.feature?.requestedFeature).filter((x) => !!x),
    [features],
  );

  return <CombinedFeaturePanel features={resolvedFeatures} />;
}

PlaceDetailPage.getLayout = getLayout;
