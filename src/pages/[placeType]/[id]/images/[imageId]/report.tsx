import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { FeaturePanelContext } from "~/components/CombinedFeaturePanel/FeaturePanelContext";
import { getLayout } from "~/components/CombinedFeaturePanel/PlaceLayout";
import { useAppStateAwareRouter } from "~/lib/util/useAppStateAwareRouter";

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
