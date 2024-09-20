import React, {
  createContext, FC, ReactNode, useMemo, useRef,
} from 'react'
import { t } from 'ttag'
import styled from 'styled-components'
import { AnyFeature } from '../../lib/model/geo/AnyFeature'
import { useMultipleFeaturesOptional } from '../../lib/fetchers/fetchMultipleFeatures'
import Spinner from '../ActivityIndicator/Spinner'
import { useAppStateAwareRouter } from '../../lib/util/useAppStateAwareRouter'
import { rolloutOsmFeatureIds } from '../../lib/model/osm/rolloutOsmFeatureIds'

interface FeaturePanelContextType {
  features: AnyFeature[]
  isLoading: boolean,
  error: unknown,
  baseFeatureUrl: string
}

export const FeaturePanelContext = createContext<FeaturePanelContextType>({
  features: [],
  isLoading: false,
  error: null,
  baseFeatureUrl: '',
})

const allowedPlaceTypes = [
  // outdated
  'composite',
  'entrances_or_exits', 'buildings', 'amenities',
  // osm-style
  'node', 'way', 'relation',
  // rdf style
  'ac:PlaceInfo', 'ac:EquipmentInfo',
] as const

function buildFeatureIds(placeType: string, ids: string[]) {
  if (!allowedPlaceTypes.includes(placeType as any)) {
    throw new Error(`Invalid or unknown placeType: ${placeType}`)
  }

  if (placeType === 'composite') {
    return ids
  }

  if (placeType === 'way' || placeType === 'relation' || placeType === 'node') {
    return rolloutOsmFeatureIds(placeType, ids)
  }

  return ids.map((id) => `${placeType}:${id}`)
}

export const ErrorToolBar: FC = () => {
  const ref = useRef(null)
  return (
    <p className="_title" ref={ref}>Something did not work right</p>
  )
}

const StyledLoadingDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px;
`

export function FeaturePanelContextProvider(
  { featureIds: passedFeatureIds, children }:
  { featureIds?: string | string[], children: ReactNode },
) {
  const { query: { placeType, id: idOrIds } } = useAppStateAwareRouter()
  const baseFeatureUrl = `/${placeType}/${idOrIds}`

  const ids = Array.isArray(idOrIds) ? idOrIds : idOrIds?.split(',') || []
  const featureIds = passedFeatureIds ?? buildFeatureIds(String(placeType), ids)

  const {
    data, isLoading, isValidating, error,
  } = useMultipleFeaturesOptional(
    featureIds,
    {
      shouldRetryOnError: false,
    },
  )

  const isBusy = (isLoading || isValidating) && !data
  const filteredFeatures = data?.filter((f) => (f && f.status === 'fulfilled' && f.value))
    .map((f) => (f as PromiseFulfilledResult<AnyFeature>).value)

  const hasError = error || !filteredFeatures || filteredFeatures.length === 0

  const contextValue = useMemo(() => ({
    features: filteredFeatures || [],
    isLoading: isBusy,
    error: hasError,
    baseFeatureUrl,
  }), [filteredFeatures, isBusy, hasError, baseFeatureUrl])

  return (
    <FeaturePanelContext.Provider value={contextValue}>
      {(hasError && !isBusy) && <ErrorToolBar />}
      {isBusy && (
        <StyledLoadingDiv className="_loading">
          <Spinner size={50} />
          <p className="_title">{t`Loading further details…`}</p>
        </StyledLoadingDiv>
      )}
      {(!isBusy && !hasError) && children}
    </FeaturePanelContext.Provider>
  )
}
