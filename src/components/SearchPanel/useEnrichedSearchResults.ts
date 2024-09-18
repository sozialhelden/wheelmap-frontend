import { useMemo } from 'react'
import useSWR from 'swr'
import fetchPlacesOnKomootPhoton from '../../lib/fetchers/fetchPlacesOnKomootPhoton'
import { useMultipleFeaturesOptional } from '../../lib/fetchers/fetchMultipleFeatures'
import { AnyFeature, TypeTaggedPlaceInfo, TypeTaggedSearchResultFeature } from '../../lib/model/geo/AnyFeature'
import { useSameAsOSMIdPlaceInfos } from '../../lib/fetchers/ac/useSameAsOSMIdPlaceInfos'
import { buildId, buildOSMUri } from './komootHelpers'

const emptyArray: any[] = []

export type EnrichedSearchResult = {
  '@type': 'wheelmap:EnrichedSearchResult',
  komootPhotonResult: TypeTaggedSearchResultFeature
  featureId?: string
  osmFeatureLoading: boolean
  osmFeature: AnyFeature | null
  placeInfoLoading: boolean
  placeInfo: TypeTaggedPlaceInfo | null
}

export function useEnrichedSearchResults(searchQuery: string | undefined | null, lat?: number | null, lon?: number | null) {
  const queryData = useMemo(
    () => ({
      query: searchQuery?.trim(),
      additionalQueryParameters: {
        lat: typeof lat === 'number' ? String(lat) : undefined,
        lon: typeof lat === 'number' ? String(lon) : undefined,
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchQuery],
  )

  const {
    data: searchResults,
    isLoading: isKomootPhotonLoading,
    isValidating: isKomootPhotonValidating,
    error: searchError,
  } = useSWR(
    queryData,
    fetchPlacesOnKomootPhoton,
    {
      keepPreviousData: false,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )
  const isSearching = (isKomootPhotonLoading || isKomootPhotonValidating)

  const featureIds = searchResults?.features.map(buildId) || emptyArray
  const { isLoading: isOsmLoading, isValidating: isOsmValidating, data: osmFeatureResults } = useMultipleFeaturesOptional(
    featureIds,
    {
      errorRetryCount: 0,
      keepPreviousData: false,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  const isFetchingOsmDetails = (isOsmLoading || isOsmValidating)

  const osmUris = searchResults?.features.map(buildOSMUri) || emptyArray
  const { isLoading: isLoadingPlaceInfos, isValidating: isValidatingPlaceInfos, data: placeInfoResults } = useSameAsOSMIdPlaceInfos(
    osmUris.filter(Boolean),
    {
      errorRetryCount: 0,
      keepPreviousData: false,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  const enrichedSearchResults = useMemo(() => {
    if (!searchResults || !searchResults.features) {
      return undefined
    }

    const extendedSearchResults = searchResults.features.map((feature) => ({
      '@type': 'wheelmap:EnrichedSearchResult',
      komootPhotonResult: {
        '@type': 'komoot:SearchResult',
        ...feature,
      },
      osmFeatureLoading: !!osmFeatureResults,
      osmFeature: null,
      placeInfoLoading: !!placeInfoResults,
      placeInfo: null,
    } as EnrichedSearchResult))

    if (osmFeatureResults) {
      // merge searchResults with osmFeatureResults
      for (let i = 0; i < osmFeatureResults.length; i++) {
        const osmFeatureResult = osmFeatureResults[i]

        if (!osmFeatureResult || osmFeatureResult.status === 'rejected') {
          continue
        }

        const osmFeature = osmFeatureResult.value
        if (osmFeature) {
          extendedSearchResults[i].osmFeature = osmFeature
          extendedSearchResults[i].featureId = featureIds[i]
        }
      }
    }

    if (placeInfoResults && placeInfoResults.features) {
      // merge searchResults with placeInfoResults
      for (const placeInfoResult of placeInfoResults.features) {
        if (!placeInfoResult.properties.sameAs) {
          continue
        }

        for (const uri of placeInfoResult.properties.sameAs) {
          const index = osmUris.indexOf(uri)
          if (index !== -1) {
            extendedSearchResults[index].placeInfo = {
              '@type': 'a11yjson:PlaceInfo',
              ...placeInfoResult,
            } as TypeTaggedPlaceInfo
            break
          }
        }
      }
    }

    return extendedSearchResults
  }, [searchResults, featureIds, osmFeatureResults, osmUris, placeInfoResults])

  const isFetchingPlaceInfos = (isLoadingPlaceInfos || isValidatingPlaceInfos)

  return {
    searchResults: enrichedSearchResults,
    isSearching,
    searchError,
    isFetchingOsmDetails,
    isFetchingPlaceInfos,
  }
}
