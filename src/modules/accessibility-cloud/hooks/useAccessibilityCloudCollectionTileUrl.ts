import { useAccessibilityCloudCollectionUrl } from "~/modules/accessibility-cloud/hooks/useAccessibilityCloudCollectionUrl";
import type { NestedRecord } from "~/utils/search-params";

export const useAccessibilityCloudCollectionTileUrl = ({
  collection,
  params = {},
}: {
  collection: string;
  params?: NestedRecord<string | undefined>;
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
