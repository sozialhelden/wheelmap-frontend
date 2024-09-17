import { useMemo } from 'react'
import useSWR from 'swr'
import fetchPlacesOnKomootPhoton, { KomootPhotonResultFeature } from '../../lib/fetchers/fetchPlacesOnKomootPhoton'
import { useMultipleFeaturesOptional } from '../../lib/fetchers/fetchMultipleFeatures'
import { AnyFeature } from "../../lib/model/geo/AnyFeature"
import { PlaceInfo } from "@sozialhelden/a11yjson"

const emptyArray: any[] = []

export type EnrichedSearchResult = KomootPhotonResultFeature & {
  osmFeatureLoading: boolean
  osmFeature: AnyFeature | null
  placeInfoLoading: boolean
  placeInfo: PlaceInfo | null
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

export function useEnrichedSearchResults(searchQuery: string | undefined, lat: number | undefined, lon: number | undefined) {
  const queryData = useMemo(() => ({
    query: searchQuery?.trim(),
    // additionalQueryParameters: {
    //   lat: typeof lat === 'number' ? String(lat) : undefined,
    //   lon:  typeof lat === 'number' ? String(lon) : undefined
    // }
  }), [searchQuery, lat, lon])

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

  const featureIds = searchResults?.features.map(buildId) || emptyArray
  const { isLoading: isAcLoading, isValidating: isAcValidating, data: osmFeatureResults } = useMultipleFeaturesOptional(
    featureIds.filter(Boolean),
    {
      errorRetryCount: 0,
    },
  )

  const isSearching = (isKomootPhotonLoading || isKomootPhotonValidating)
  const isFetchingDetails = (isAcLoading || isAcValidating)

  // https://accessibility-cloud-v2.freetls.fastly.net/place-infos.json?appToken=27be4b5216aced82122d7cf8f69e4a07&includePlacesWithoutAccessibility=1&sameAs=https://openstreetmap.org/node/3864666405,https://openstreetmap.org/node/4351422254

  // console.log('featureIds', { featureIds, osmFeatureResults })

  return {
    searchResults,
    isSearching,
    searchError,
    isFetchingDetails,
  }
}
