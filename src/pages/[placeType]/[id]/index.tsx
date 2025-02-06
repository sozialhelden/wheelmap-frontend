import { useContext, useMemo } from "react";
import { CombinedFeaturePanel } from "../../../components/CombinedFeaturePanel/CombinedFeaturePanel";
import { FeaturePanelContext } from "../../../components/CombinedFeaturePanel/FeaturePanelContext";
import { getLayout } from "../../../components/CombinedFeaturePanel/PlaceLayout";

export default function PlaceFeaturePage() {
  const { features } = useContext(FeaturePanelContext);
  const resolvedFeatures = useMemo(
    () => features.map((x) => x.feature?.requestedFeature).filter((x) => !!x),
    [features],
  );

  return <CombinedFeaturePanel features={resolvedFeatures} />;
}

PlaceFeaturePage.getLayout = getLayout;
