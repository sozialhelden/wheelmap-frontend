import { useAccessibilityCloudCollectionUrl } from "~/modules/accessibility-cloud/hooks/useAccessibilityCloudCollectionUrl";

export const useAccessibilityCloudCollectionTileUrl = ({
  collection,
  params = {},
}: {
  collection: string;
  params?: Record<string, string>;
}) => {
  return useAccessibilityCloudCollectionUrl({
    collection,
    format: "mvt",
    cached: true,
    params: {
      ...params,
      includePlacesWithoutAccessibility: "1",
    },
    suffix: "&x={x}&y={y}&z={z}",
  });
};
