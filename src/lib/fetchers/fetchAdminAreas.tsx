import React from "react";
import useSWR from "swr";
import { useEnvContext } from "../../components/shared/EnvContext";
import OSMFeature from "../model/osm/OSMFeature";
import { OSMFeatureCollection } from "../model/shared/AnyFeature";

export async function fetchOSMFeatures(
  table: string,
  baseUrl: string,
  longitude: number,
  latitude: number
): Promise<OSMFeatureCollection | undefined> {
  const response = await fetch(`${baseUrl}/${table}.json?geometryTypes=centroid&limit=1000&lon=${longitude}&lat=${latitude}`)
  const featureCollection = await response.json();
  return {
    ["@type"]: "osm:FeatureCollection",
    ...featureCollection,
  } as OSMFeatureCollection;
}

export function useAdminAreas({ longitude, latitude }: { longitude: number, latitude: number }) {
  const env = useEnvContext();
  const baseUrl = env.NEXT_PUBLIC_OSM_API_BACKEND_URL;
  const table = "admin_gen0";
  const features = useSWR(
    baseUrl && latitude && longitude && [table, baseUrl, longitude, latitude],
    fetchOSMFeatures
  );
  const result = React.useMemo(() => {
    const featuresByType = features?.data?.features?.reduce((acc, feature) => {
      const type = feature.properties['border_type'] || feature.properties['place'];
      if (!type) {
        return acc;
      }
      acc[type] = feature;
      return acc;
    }, {} as Record<string, OSMFeature>);
    return {
      features,
      featuresByType,
    };
  }, [features]);
  return result;
}

export const AdminAreaContext = React.createContext<ReturnType<typeof useAdminAreas>>(null as any);

export function useAdminAreaContext() {
  return React.useContext(AdminAreaContext);
}