import CombinedFeaturePanelWrapper from "~/app/(app)/(map)/[placeType]/[placeId]/_components/CombinedFeaturePanelWrapper";
import { getDefaultMetadata } from "~/utils/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ placeType: string; placeId: string }>;
}) {
  const { placeType, placeId } = await params;

  // TODO: this is part of a temporary workaround. please refactor the feature panel context
  //  and the CombinedFeaturePanel to use next js server components and data fetching
  //  properly. then we can fetch actual place details here and return proper metadata

  return await getDefaultMetadata();
}

/**
 * Main place detail page: `/:placeType/:placeId`
 */
export default function PlacePage() {
  return <CombinedFeaturePanelWrapper />;
}
