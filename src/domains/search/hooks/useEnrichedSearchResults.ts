import type { PlaceInfo } from "@sozialhelden/a11yjson";
import { useContext, useMemo } from "react";
import useSWR from "swr";
import { useMap } from "~/components/Map/useMap";
import type { EnrichedSearchResult } from "~/domains/search/types/EnrichedSearchResult";
import { AppContext } from "~/lib/context/AppContext";
import { useCurrentLanguageTagStrings } from "~/lib/context/LanguageTagContext";
import useCollectionSWR from "~/lib/fetchers/ac/useCollectionSWR";
import { useSameAsOSMIdPlaceInfos } from "~/lib/fetchers/ac/useSameAsOSMIdPlaceInfos";
import fetchPhotonFeatures from "~/lib/fetchers/fetchPhotonFeatures";
import { useFeatures } from "~/lib/fetchers/useFeatures";
import type { TypeTaggedPlaceInfo } from "~/lib/model/geo/AnyFeature";
import { getLocalizedAddressString } from "~/lib/model/geo/getAddressString";
import { useAppStateAwareRouter } from "~/lib/util/useAppStateAwareRouter";
import {
  buildId,
  buildOSMUri,
  makeDisplayDataFromPhotonResult,
} from "../functions/data-mapping";

export function useEnrichedSearchResults(
  searchQuery: string | undefined | null,
) {
  const router = useAppStateAwareRouter();
  const { map } = useMap();

  const lat = map?.getCenter().lat || router.searchParams.lat;
  const lon = map?.getCenter().lng || router.searchParams.lon;

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
    data: photonSearchResults,
    isLoading: isPhotonLoading,
    isValidating: isPhotonValidating,
    error: photonSearchError,
  } = useSWR(photonQuery, fetchPhotonFeatures, {
    keepPreviousData: true,
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

  const featureIds = photonSearchResults?.features.map(buildId) || [];

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

  const osmUris = photonSearchResults?.features.map(buildOSMUri) || [];
  const {
    isLoading: isLoadingPlaceInfos,
    isValidating: isValidatingPlaceInfos,
    data: placeInfoResults,
  } = useSameAsOSMIdPlaceInfos(
    osmUris.filter((uri) => typeof uri === "string"),
    {
      errorRetryCount: 0,
      keepPreviousData: true,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const enrichedSearchResults = useMemo(() => {
    if (!photonSearchResults || !photonSearchResults.features) {
      return undefined;
    }

    const allOsmUrls = new Set(
      photonSearchResults.features.map((f) => buildOSMUri(f)),
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

    const extendedPhotonSearchResults = photonSearchResults.features.map(
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

    const osmMergedPhotonSearchResults: EnrichedSearchResult[] =
      osmFeatureResults
        ? // merge photonSearchResults with osmFeatureResults
          extendedPhotonSearchResults.map((photonResult) => {
            const match = osmFeatureResults.find((osmResult) => {
              const numericId = Number.parseInt(
                osmResult?.feature._id.split("/")[1],
              );
              return photonResult.photonResult?.properties.osm_id === numericId;
            });
            return match
              ? {
                  ...photonResult,
                  osmFeature: { ...match.feature },
                }
              : { ...photonResult };
          })
        : extendedPhotonSearchResults;

    if (osmFeatureResults) {
      for (let i = 0; i < osmFeatureResults.length; i++) {
        osmMergedPhotonSearchResults[i].featureId = featureIds[i];
      }
    }

    if (placeInfoResults?.features) {
      // merge photonSearchResults with placeInfoResults
      for (const placeInfoResult of placeInfoResults.features) {
        if (!placeInfoResult.properties.sameAs) {
          continue;
        }

        for (const uri of placeInfoResult.properties.sameAs) {
          const index = osmUris.indexOf(uri);
          if (index !== -1) {
            osmMergedPhotonSearchResults[index].placeInfo = {
              "@type": "ac:PlaceInfo",
              ...placeInfoResult,
            } as TypeTaggedPlaceInfo;
            break;
          }
        }
      }
    }

    return [...osmMergedPhotonSearchResults, ...extendedAcSearchResults];
  }, [
    photonSearchResults,
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
    searchError: photonSearchError,
    isFetchingOsmDetails,
    isFetchingPlaceInfos,
  };
}
