import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { FeaturePanelContext } from "~/needs-refactoring/components/CombinedFeaturePanel/FeaturePanelContext";
import { useAppStateAwareRouter } from "~/needs-refactoring/lib/util/useAppStateAwareRouter";
import { getLayout } from "../../_components/PlaceDetailsLayout";

// @legacy-route
export default function ShowReportPage() {
  const router = useAppStateAwareRouter();
  const { baseFeatureUrl } = useContext(FeaturePanelContext);
  const {
    query: { imageId },
  } = useRouter();

  const id = typeof imageId === "string" ? imageId : imageId[0];

  // biome-ignore lint/correctness/useExhaustiveDependencies: Effect happens only once.
  useEffect(() => {
    // redirect to single image as the report doesn't have its own page anymore
    router.replace(`${baseFeatureUrl}/images/${id}`);
  }, []);
}

ShowReportPage.getLayout = getLayout;
