import { useMemo } from "react";
import useSWRInfinite, { type SWRInfiniteConfiguration } from "swr/infinite";
import useAccessibilityCloudApi, {} from "~/hooks/useAccessibilityCloudApi";
import useOsmApi, {} from "~/hooks/useOsmApi";
import {
  type FetchOneFeatureProperties,
  type FetchOneFeatureResult,
  composeFetchOneFeature,
} from "./fetchers";
import type { FeatureId } from "./types";
import { makeFetchProperties } from "./utils";

export const useFeatures = (
  features: (FeatureId | undefined)[],
  options?: {
    swr?: SWRInfiniteConfiguration<FetchOneFeatureResult>;
    cache?: boolean;
  },
) => {
  const { baseUrl: osmBaseUrl, appToken: osmAppToken } = useOsmApi({
    cached: Boolean(options?.cache),
  });
  const { baseUrl: acBaseUrl, appToken: acAppToken } = useAccessibilityCloudApi(
    {
      cached: Boolean(options?.cache),
    },
  );

  const [properties, uris] = useMemo(() => {
    // building additional properties, such as the fetcher can add additional attributes
    const fetcherProperties: Record<string, FetchOneFeatureProperties> = {};
    const fetchUris: string[] = features
      .map((feature) => {
        if (!feature) {
          return null;
        }

        const fetchProps = makeFetchProperties(feature, {
          acBaseUrl,
          acAppToken,
          osmBaseUrl,
          osmAppToken,
        });

        fetcherProperties[fetchProps.url] = fetchProps;
        return fetchProps.url;
      })
      .filter(Boolean);
    return [fetcherProperties, fetchUris] as const;
  }, [acAppToken, acBaseUrl, features, osmAppToken, osmBaseUrl]);

  const fetchOneFeature = useMemo(
    () => composeFetchOneFeature(properties),
    [properties],
  );
  const response = useSWRInfinite((index) => uris[index], fetchOneFeature, {
    initialSize: uris.length,
    ...options?.swr,
  });
  return response;
};
