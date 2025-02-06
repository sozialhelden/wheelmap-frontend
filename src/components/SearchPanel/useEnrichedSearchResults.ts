import type { PlaceInfo } from "@sozialhelden/a11yjson";
import { useContext, useMemo } from "react";
import useSWR from "swr";
import { AppContext } from "../../lib/context/AppContext";
import { useCurrentLanguageTagStrings } from "../../lib/context/LanguageTagContext";
import useCollectionSWR from "../../lib/fetchers/ac/useCollectionSWR";
import { useSameAsOSMIdPlaceInfos } from "../../lib/fetchers/ac/useSameAsOSMIdPlaceInfos";
import fetchPhotonFeatures from "../../lib/fetchers/fetchPhotonFeatures";
import { useFeatures } from "../../lib/fetchers/useFeatures";
import type { TypeTaggedPlaceInfo } from "../../lib/model/geo/AnyFeature";
import { getLocalizedAddressString } from "../../lib/model/geo/getAddressString";
import {
  type EnrichedSearchResult,
  makeDisplayDataFromPhotonResult,
} from "./EnrichedSearchResult";
import { buildId, buildOSMUri } from "./photonFeatureHelpers";

export function useEnrichedSearchResults(
  searchQuery: string | undefined | null,
  lat?: number | null,
  lon?: number | null,
) {
  const { clientSideConfiguration } = useContext(AppContext) ?? {
    clientSideConfiguration: undefined,
  };
  const languageTag = useCurrentLanguageTagStrings()?.[0] || "en";

  const photonQuery = useMemo(
    () => ({
      languageTag,
      query: searchQuery?.trim(),
      additionalQueryParameters: {
        lat: typeof lat === "number" ? String(lat) : undefined,
        lon: typeof lat === "number" ? String(lon) : undefined,
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchQuery, languageTag, lat, lon],
  );

  const {
    data: searchResults,
    isLoading: isPhotonLoading,
    isValidating: isPhotonValidating,
    error: searchError,
  } = useSWR(photonQuery, fetchPhotonFeatures, {
    keepPreviousData: false,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const placesUrlParams = useMemo(() => {
    if (
      !searchQuery ||
      searchQuery.trim().length <= 2 ||
      !clientSideConfiguration
    ) {
      return undefined;
    }

    const wheelmapSourceId = "LiBTS67TjmBcXdEmX";
    const excludedSourceIds = clientSideConfiguration.excludeSourceIds || [];
    excludedSourceIds.push(wheelmapSourceId);
    const includedSourceIds = clientSideConfiguration.includeSourceIds || [];

    return new URLSearchParams({
      q: searchQuery,
      includePlacesWithoutAccessibility: "1",
      ...(includedSourceIds.length > 0
        ? { includeSourceIds: includedSourceIds.join(",") }
        : undefined),
      ...(excludedSourceIds.length > 0
        ? { excludeSourceIds: excludedSourceIds.join(",") }
        : undefined),
      // search with text & geoNear is not supported by the API
    });
  }, [searchQuery, clientSideConfiguration]);

  const {
    isLoading: isAcSearchLoading,
    isValidating: isAcSearchValidating,
    data: acSearchResults,
  } = useCollectionSWR<"ac:PlaceInfo", PlaceInfo, "FeatureCollection">({
    type: "ac:PlaceInfo",
    params: placesUrlParams,
    shouldRun: !!placesUrlParams,
  });

  const isSearching =
    isPhotonLoading ||
    isPhotonValidating ||
    isAcSearchLoading ||
    isAcSearchValidating;

  const featureIds = searchResults?.features.map(buildId) || [];

  const {
    isLoading: isOsmLoading,
    isValidating: isOsmValidating,
    data: osmFeatureResults,
  } = useFeatures(featureIds, {
    swr: {
      errorRetryCount: 0,
      keepPreviousData: false,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  });

  const isFetchingOsmDetails = isOsmLoading || isOsmValidating;

  const osmUris = searchResults?.features.map(buildOSMUri) || [];
  const {
    isLoading: isLoadingPlaceInfos,
    isValidating: isValidatingPlaceInfos,
    data: placeInfoResults,
  } = useSameAsOSMIdPlaceInfos(
    osmUris.filter((uri) => typeof uri === "string"),
    {
      errorRetryCount: 0,
      keepPreviousData: false,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const enrichedSearchResults = useMemo(() => {
    if (!searchResults || !searchResults.features) {
      return undefined;
    }

    const allOsmUrls = new Set(
      searchResults.features.map((f) => buildOSMUri(f)),
    );
    // remove all osm features that are already in the search results
    const filteredAcSearchResults =
      acSearchResults?.features.filter((f: PlaceInfo) => {
        if (!f.properties || !f.geometry?.coordinates) {
          return false;
        }

        if (!f.properties.sameAs) {
          return true;
        }

        for (const url of f.properties.sameAs) {
          if (allOsmUrls.has(url)) {
            return false;
          }
        }
        return true;
      }) || [];

    const extendedAcSearchResults: EnrichedSearchResult[] =
      filteredAcSearchResults.map(
        (feature: PlaceInfo): EnrichedSearchResult => ({
          "@type": "wheelmap:EnrichedSearchResult",
          displayData: {
            title: feature.properties.name,
            address: feature.properties.address
              ? getLocalizedAddressString(feature.properties.address)
              : undefined,
            lat: feature.geometry.coordinates[1],
            lon: feature.geometry.coordinates[0],
          },
          photonResult: null,
          osmFeatureLoading: false,
          osmFeature: null,
          placeInfoLoading: false,
          placeInfo: {
            "@type": "ac:PlaceInfo",
            ...feature,
          } as TypeTaggedPlaceInfo,
        }),
      );

    const extendedPhotonSearchResults = searchResults.features.map(
      (feature): EnrichedSearchResult => ({
        "@type": "wheelmap:EnrichedSearchResult",
        displayData: makeDisplayDataFromPhotonResult(feature),
        photonResult: {
          "@type": "photon:SearchResult",
          ...feature,
        },
        osmFeatureLoading: !!osmFeatureResults,
        osmFeature: null,
        placeInfoLoading: !!placeInfoResults,
        placeInfo: null,
      }),
    );

    if (osmFeatureResults) {
      // merge searchResults with osmFeatureResults
      for (let i = 0; i < osmFeatureResults.length; i++) {
        const osmFeatureResult = osmFeatureResults[i];

        if (!osmFeatureResult) {
          continue;
        }

        const osmFeature = osmFeatureResult.feature;
        if (osmFeature) {
          extendedPhotonSearchResults[i].osmFeature = osmFeature;
          extendedPhotonSearchResults[i].featureId = featureIds[i];
        }
      }
    }

    if (placeInfoResults?.features) {
      // merge searchResults with placeInfoResults
      for (const placeInfoResult of placeInfoResults.features) {
        if (!placeInfoResult.properties.sameAs) {
          continue;
        }

        for (const uri of placeInfoResult.properties.sameAs) {
          const index = osmUris.indexOf(uri);
          if (index !== -1) {
            extendedPhotonSearchResults[index].placeInfo = {
              "@type": "ac:PlaceInfo",
              ...placeInfoResult,
            } as TypeTaggedPlaceInfo;
            break;
          }
        }
      }
    }

    return [...extendedPhotonSearchResults, ...extendedAcSearchResults];
  }, [
    searchResults,
    featureIds,
    osmFeatureResults,
    osmUris,
    placeInfoResults,
    acSearchResults,
  ]);

  const isFetchingPlaceInfos = isLoadingPlaceInfos || isValidatingPlaceInfos;

  return {
    searchResults: enrichedSearchResults,
    isSearching,
    searchError,
    isFetchingOsmDetails,
    isFetchingPlaceInfos,
  };
}
