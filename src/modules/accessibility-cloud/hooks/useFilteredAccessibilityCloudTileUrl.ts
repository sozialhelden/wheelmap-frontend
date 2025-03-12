import { useFilteredAccessibilityCloudCollectionUrl } from "~/modules/accessibility-cloud/hooks/useFilteredAccessibilityCloudCollectionUrl";

export const useFilteredAccessibilityCloudTileUrl = ({
  collection,
}: {
  collection: string;
}) => {
  return useFilteredAccessibilityCloudCollectionUrl({
    collection,
    format: "mvt",
    cached: true,
    params: {
      includePlacesWithoutAccessibility: "1",
    },
    suffix: "&x={x}&y={y}&z={z}",
  });
};
