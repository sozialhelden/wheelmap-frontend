import { hasAccessibleToilet } from "~/needs-refactoring/lib/model/ac/Feature";
import { useNearbyFeatures } from "~/needs-refactoring/lib/fetchers/osm-api/fetchNearbyFeatures";
import type { AnyFeature } from "~/needs-refactoring/lib/model/geo/AnyFeature";

export type NextToilet = {
  properties: {
    _id: string | number;
    distance: string | number;
  };
};

export function useNextToilet(feature: AnyFeature) {
  const shouldShowNextToilets = hasAccessibleToilet(feature) !== "yes";
  const {
    response: { isLoading },
    nearbyFeatures,
  } = useNearbyFeatures(shouldShowNextToilets && feature, {
    wheelchair: "yes",
  });
  const nextToilet: NextToilet | undefined = nearbyFeatures?.[0];

  return { nextToilet, isLoadingNextToilet: isLoading };
}
