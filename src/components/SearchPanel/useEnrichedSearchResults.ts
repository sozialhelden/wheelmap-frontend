import { useMemo } from 'react'
import useSWR from 'swr'
import fetchPlacesOnKomootPhoton, {
  KomootPhotonResultFeature,
} from '../../lib/fetchers/fetchPlacesOnKomootPhoton'
import { useMultipleFeaturesOptional } from '../../lib/fetchers/fetchMultipleFeatures'
import { AnyFeature, TypeTaggedPlaceInfo, TypeTaggedSearchResultFeature } from '../../lib/model/geo/AnyFeature'
import { useSameAsOSMIdPlaceInfos } from '../../lib/fetchers/ac/useSameAsOSMIdPlaceInfos'

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

export function buildId(feature: KomootPhotonResultFeature) {
  const osmType = {
    N: 'node',
    W: 'way',
    R: 'relation',
  }[feature.properties.osm_type || 'N']

  if (feature.properties.osm_key === 'place') {
    return undefined
  }

  return `amenities:${osmType}:${feature.properties.osm_id}`
}

export function buildOSMUri(feature: KomootPhotonResultFeature) {
  const osmType = {
    N: 'node',
    W: 'way',
    R: 'relation',
  }[feature.properties.osm_type || 'N']
  return `https://openstreetmap.org/${osmType}/${feature.properties.osm_id}`
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
    },
  )
  const isSearching = (isKomootPhotonLoading || isKomootPhotonValidating)

  const featureIds = searchResults?.features.map(buildId) || emptyArray
  const { isLoading: isOsmLoading, isValidating: isOsmValidating, data: osmFeatureResults } = useMultipleFeaturesOptional(
    featureIds.filter(Boolean),
    {
      errorRetryCount: 0,
      keepPreviousData: false,
    },
  )

  const isFetchingOsmDetails = (isOsmLoading || isOsmValidating)

  const osmUris = searchResults?.features.map(buildOSMUri) || emptyArray
  const { isLoading: isLoadingPlaceInfos, isValidating: isValidatingPlaceInfos, data: placeInfoResults } = useSameAsOSMIdPlaceInfos(
    osmUris,
    {
      errorRetryCount: 0,
      keepPreviousData: false,
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
      let lastFoundIndex = -1

      // merge searchResults with osmFeatureResults
      for (const osmFeatureResult of osmFeatureResults) {
        if (!osmFeatureResult || osmFeatureResult.status === 'rejected') {
          continue
        }
        const osmFeature = osmFeatureResult.value
        const featureId = `amenities:${osmFeature._id.replace('/', ':')}`
        const index = featureIds.indexOf(featureId, lastFoundIndex + 1)
        if (index !== -1) {
          lastFoundIndex = index
          extendedSearchResults[index].osmFeature = osmFeature
          extendedSearchResults[index].featureId = featureId
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
