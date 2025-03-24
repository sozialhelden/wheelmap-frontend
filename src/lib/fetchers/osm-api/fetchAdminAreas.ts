import React from "react";
import useSWR from "swr";
import { useEnvironmentContext } from "~/modules/app/context/EnvironmentContext";
import type { OSMFeatureCollection } from "../../model/geo/AnyFeature";
import type OSMFeature from "../../model/osm/OSMFeature";
import useInhouseOSMAPI from "./useInhouseOSMAPI";

export async function fetchOSMFeatures([table, baseUrl, longitude, latitude]: [
  string,
  string,
  number,
  number,
]): Promise<OSMFeatureCollection | undefined> {
  const response = await fetch(
    `${baseUrl}/${table}.json?geometryTypes=centroid&limit=1000&lon=${longitude}&lat=${latitude}`,
  );
  const featureCollection = await response.json();
  return {
    "@type": "osm:FeatureCollection",
    ...featureCollection,
  } as OSMFeatureCollection;
}

export function useAdminAreas({
  longitude,
  latitude,
}: { longitude: number | undefined; latitude: number | undefined }) {
  const { baseUrl } = useInhouseOSMAPI({ cached: true });
  const table = "admin_gen0";
  const features = useSWR(
    baseUrl && latitude && longitude
      ? [table, baseUrl, longitude, latitude]
      : null,
    fetchOSMFeatures,
  );
  const result = React.useMemo(() => {
    const featuresByType = features?.data?.features?.reduce(
      (acc, feature) => {
        const type = feature.properties.border_type || feature.properties.place;
        if (!type) {
          return acc;
        }
        acc[type] = feature;
        return acc;
      },
      {} as Record<string, OSMFeature>,
    );
    return {
      features,
      featuresByType,
    };
  }, [features]);
  return result;
}

const emptyFeaturesResponse = {
  data: undefined,
  error: undefined,
  mutate: async () => undefined,
  isLoading: false,
  isValidating: false,
};
export const AdminAreaContext = React.createContext<
  ReturnType<typeof useAdminAreas>
>({
  features: emptyFeaturesResponse,
  featuresByType: {},
});

export function useAdminAreaContext() {
  return React.useContext(AdminAreaContext);
}
