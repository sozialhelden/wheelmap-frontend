import { hasAccessibleToilet } from "~/needs-refactoring/lib/model/ac/Feature";
import { useNearbyFeatures } from "~/needs-refactoring/lib/fetchers/osm-api/fetchNearbyFeatures";
import type { AnyFeature } from "~/needs-refactoring/lib/model/geo/AnyFeature";

export type NextAccessibleToilet = {
  properties: {
    _id: string | number;
    distance: string | number;
  };
};

export function useNextAccessibleToilet(feature: AnyFeature) {
  const shouldShowNextToilets = hasAccessibleToilet(feature) !== "yes";
  const {
    response: { isLoading },
    nearbyFeatures,
  } = useNearbyFeatures(shouldShowNextToilets && feature, {
    wheelchair: "yes",
  });
  const nextAccessibleToilet: NextAccessibleToilet | undefined =
    nearbyFeatures?.[0];

  return { nextAccessibleToilet, isLoadingNextToilet: isLoading };
}
