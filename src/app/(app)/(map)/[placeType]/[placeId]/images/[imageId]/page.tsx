import CombinedFeaturePanelWrapper from "~/app/(app)/(map)/[placeType]/[placeId]/_components/CombinedFeaturePanelWrapper";
export { generateMetadata } from "~/app/(app)/(map)/[placeType]/[placeId]/page";

/**
 * Place detail image page: `/:placeType/:placeId/images/:imageId`
 */
export default function PlacePage({
  params: { imageId },
}: { params: { imageId: string | string[] } }) {
  return (
    <CombinedFeaturePanelWrapper activeImageId={[imageId].flat().shift()} />
  );
}
