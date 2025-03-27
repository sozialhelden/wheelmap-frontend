import { useRouter } from "next/router";
import { useContext, useMemo } from "react";
import { CombinedFeaturePanel } from "~/needs-refactoring/components/CombinedFeaturePanel/CombinedFeaturePanel";
import { FeaturePanelContext } from "~/needs-refactoring/components/CombinedFeaturePanel/FeaturePanelContext";
import { getLayout } from "../../_components/PlaceDetailsLayout";

export default function ShowImagePage() {
  const { features } = useContext(FeaturePanelContext);
  const resolvedFeatures = useMemo(
    () =>
      features
        .map(({ feature }) => feature?.requestedFeature)
        .filter((feature) => !!feature),
    [features],
  );
  const {
    query: { imageId },
  } = useRouter();

  const id = typeof imageId === "string" ? imageId : imageId[0];
  return (
    <CombinedFeaturePanel features={resolvedFeatures} activeImageId={id} />
  );
}

ShowImagePage.getLayout = getLayout;
