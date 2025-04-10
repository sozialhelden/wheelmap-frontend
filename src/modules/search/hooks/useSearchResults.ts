import { useMemo } from "react";
import useSWR from "swr";
import { useMap } from "~/components/Map/useMap";
import fetchPhotonFeatures, {} from "~/lib/fetchers/fetchPhotonFeatures";
import getAddressString from "~/lib/model/geo/getAddressString";
import type { SearchResult } from "~/modules/search/types/SearchResult";
import { getOsmId, getUrl } from "~/modules/search/utils/data-mapping";
import { useI18nContext } from "~/modules/i18n/context/I18nContext";

const swrConfigNoRevalidation = {
  keepPreviousData: false,
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

function usePhotonSearchResults(query: string) {
  const { languageTag } = useI18nContext();

  const { map } = useMap();
  const lat = map?.getCenter().lat;
  const lon = map?.getCenter().lng;

  return useSWR(
    query && {
      languageTag,
      query,
      additionalQueryParameters: {
        lat: typeof lat === "number" ? String(lat) : undefined,
        lon: typeof lat === "number" ? String(lon) : undefined,
      },
    },
    fetchPhotonFeatures,
    swrConfigNoRevalidation,
  );
}

export function useSearchResults(givenQuery: string) {
  const query = givenQuery?.trim();

  const photonSearchQuery = usePhotonSearchResults(query);

  const searchResults: SearchResult[] = useMemo(() => {
    if (!photonSearchQuery.data) {
      return [];
    }

    const results = photonSearchQuery.data.features.map((feature) => {
      const { properties, geometry } = feature;

      const address = getAddressString({
        countryCode: properties.country,
        street: properties.street,
        house: properties.housenumber,
        postalCode: properties.postcode,
        city: properties.city,
      });

      return {
        id: getOsmId(feature),
        url: getUrl(feature),
        address,
        title: properties.name || "",
        lat: geometry.coordinates[1],
        lon: geometry.coordinates[0],
        extent: properties.extent,
        category: properties.osm_value,
      };
    });

    // filters duplicates with the same id
    return results.filter(({ id }, index) => {
      const lastIndex = results.findLastIndex(
        ({ id: otherId }) => id === otherId,
      );
      return lastIndex === index;
    });
  }, [photonSearchQuery.data]);

  return {
    searchResults,
    searchError: photonSearchQuery.error,
    isSearching: photonSearchQuery.isLoading,
  };
}
