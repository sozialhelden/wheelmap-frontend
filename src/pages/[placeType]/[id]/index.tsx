import { useContext, useMemo } from "react";
import { FeaturePanelContext } from "~/needs-refactoring/components/CombinedFeaturePanel/FeaturePanelContext";
import { getLayout } from "~/components/layouts/PlaceDetailsLayout";
import FeaturePanel from "~/modules/feature-panel/components/FeaturePanel";

export default function PlaceDetailPage() {
  const { features } = useContext(FeaturePanelContext);
  const resolvedFeatures = useMemo(
    () => features.map((x) => x.feature?.requestedFeature).filter((x) => !!x),
    [features],
  );

  // return <CombinedFeaturePanel features={resolvedFeatures} />;
  return <FeaturePanel features={resolvedFeatures} />;
}

PlaceDetailPage.getLayout = getLayout;
