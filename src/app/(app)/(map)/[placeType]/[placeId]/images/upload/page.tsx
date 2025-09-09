import CombinedFeaturePanelWrapper from "~/app/(app)/(map)/[placeType]/[placeId]/_components/CombinedFeaturePanelWrapper";
export { generateMetadata } from "~/app/(app)/(map)/[placeType]/[placeId]/page";

/**
 * Place detail upload page: `/:placeType/:placeId/images/upload`
 */
export default function PlacePage() {
  return <CombinedFeaturePanelWrapper isUploadDialogOpen />;
}
