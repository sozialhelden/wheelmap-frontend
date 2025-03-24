import { useMemo } from "react";
import useSWRInfinite, { type SWRInfiniteConfiguration } from "swr/infinite";
import { useEnvironmentContext } from "~/modules/app/context/EnvironmentContext";
import { useCurrentAppToken } from "../../context/AppContext";
import type { OSMIdWithTableAndContextNames } from "../../typing/brands/osmIds";
import { getOSMRDFComponents } from "../../typing/discriminators/osmDiscriminator";
import { getAccessibilityCloudAPI } from "../ac/useAccessibilityCloudAPI";
import {
  type FetchOsmToAcFeatureProperties,
  type FetchOsmToAcFeatureResult,
  composeOsmToAcFetcher,
} from "./fetchers";

/**
 * A hook to fetch `ac:PlaceInfo` data from multiple `osm:Feature`-RDF-URI-based entries.
 */
export const useOsmToAcFeature = (
  features: OSMIdWithTableAndContextNames[],
  options?: {
    swr?: SWRInfiniteConfiguration<FetchOsmToAcFeatureResult>;
    cache?: boolean;
  },
) => {
  const env = useEnvironmentContext();
  const currentAppToken = useCurrentAppToken();
  const { baseUrl: acBaseUrl, appToken: acAppToken } = getAccessibilityCloudAPI(
    env,
    currentAppToken,
    options?.cache ?? false,
  );

  const [properties, uris] = useMemo(() => {
    // building additional properties, such as the fetcher can add additional attributes
    const fetcherProperties: Record<string, FetchOsmToAcFeatureProperties> = {};
    const fetchUris: string[] = [];
    for (let i = 0; i < features.length; i += 1) {
      const feature = features[i];
      const components = getOSMRDFComponents(feature);

      const osmUrl = `https://openstreetmap.org/${components.properties.element}/${components.properties.value}`;
      const url = `${acBaseUrl}/place-infos.json?appToken=${acAppToken}&includePlacesWithoutAccessibility=1&sameAs=${osmUrl}`;

      fetcherProperties[url] = { url, originId: feature };
      fetchUris.push(url);
    }
    return [fetcherProperties, fetchUris] as const;
  }, [acAppToken, acBaseUrl, features]);

  const fetchOsmToAcFeature = composeOsmToAcFetcher(properties);

  const response = useSWRInfinite((index) => uris[index], fetchOsmToAcFeature, {
    initialSize: uris.length,
    ...options?.swr,
  });
  return response;
};
