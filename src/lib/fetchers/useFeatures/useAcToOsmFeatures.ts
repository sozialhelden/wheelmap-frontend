import useSWRInfinite, { type SWRInfiniteConfiguration } from "swr/infinite";
import { useCurrentAppToken } from "../../context/AppContext";
import { useEnvContext } from "../../context/EnvContext";
import type { TypeTaggedPlaceInfo } from "../../model/geo/AnyFeature";
import type { AccessibilityCloudRDFId } from "../../typing/brands/accessibilityCloudIds";
import type { OSMIdWithTableAndContextNames } from "../../typing/brands/osmIds";
import { getAccessibilityCloudAPI } from "../ac/useAccessibilityCloudAPI";
import { getInhouseOSMAPI } from "../osm-api/useInhouseOSMAPI";
import {
  type FetchOneFeatureProperties,
  type FetchOneFeatureResult,
  composeFetchOneFeature,
} from "./fetchers";
import { makeFetchProperties } from "./utils";

/**
 * Expands an OpenStreeMap URL to hopeful guesses what OSM RDF ID it may be
 */
const guesstimateRdfType = (
  osmUris: string[],
): OSMIdWithTableAndContextNames[] =>
  osmUris.flatMap((osmUri) => {
    const tail = osmUri.replace("https://openstreetmap.org/", "");
    const [element, value] = tail.split("/");
    if (!element || !value) {
      return [];
    }
    // type casting instead of checking, just to satisfy the branding constraint
    return [
      `osm:amenities/${element}/${value}`,
      `osm:buildings/${element}/${value}`,
    ] as OSMIdWithTableAndContextNames[];
  });

/**
 * A hook to fetch `osm:Feature` data from multiple `ac:PlaceInfo`-RDF-ID entries.
 */
export const useAcToOsmFeatures = (
  features: {
    feature: TypeTaggedPlaceInfo;
    originId: AccessibilityCloudRDFId;
  }[],
  options?: {
    swr?: SWRInfiniteConfiguration<FetchOneFeatureResult>;
    cache?: boolean;
  },
) => {
  const env = useEnvContext();
  const currentAppToken = useCurrentAppToken();

  const { baseUrl: osmBaseUrl, appToken: osmAppToken } = getInhouseOSMAPI(
    env,
    currentAppToken,
    options?.cache ?? false,
  );
  const { baseUrl: acBaseUrl, appToken: acAppToken } = getAccessibilityCloudAPI(
    env,
    currentAppToken,
    options?.cache ?? false,
  );

  // composing URLs, redirecting the origin feature id
  const osmRelationProperties = {
    osmUris: [] as string[],
    requestProperties: {} as Record<string, FetchOneFeatureProperties>,
  };
  for (const feature of features) {
    const guesstimatedRdfTypes = guesstimateRdfType(
      feature.feature.properties.sameAs ?? [],
    );
    if (guesstimateRdfType.length <= 0) {
      continue;
    }
    const properties = guesstimatedRdfTypes.map((x) => ({
      ...makeFetchProperties(x, {
        acBaseUrl,
        acAppToken,
        osmBaseUrl,
        osmAppToken,
      }),
      // replacing the originId, such as it shows the feature this request originally came from
      id: feature.originId,
    }));
    for (const property of properties) {
      osmRelationProperties.requestProperties[property.url] = property;
    }
    osmRelationProperties.osmUris.push(...properties.map((x) => x.url));
  }
  const additionalOSMFeaturesFetcher = composeFetchOneFeature(
    osmRelationProperties.requestProperties,
  );
  const additionalOSMFeaturesResult = useSWRInfinite(
    (idx) => osmRelationProperties.osmUris[idx],
    additionalOSMFeaturesFetcher,
    { initialSize: osmRelationProperties.osmUris.length, ...options?.swr },
  );
  return additionalOSMFeaturesResult;
};
