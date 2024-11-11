import React, {
  createContext, FC, ReactNode, useMemo, useRef,
} from 'react'
import { t } from 'ttag'
import styled from 'styled-components'
import { AnyFeature, TypeTaggedPlaceInfo } from '../../lib/model/geo/AnyFeature'
import Spinner from '../ActivityIndicator/Spinner'
import { useAppStateAwareRouter } from '../../lib/util/useAppStateAwareRouter'
import { rolloutOsmFeatureIds } from '../../lib/model/osm/rolloutOsmFeatureIds'
import { collectExpandedFeaturesResult, useExpandedFeatures } from '../../lib/fetchers/useManyFeatures'
import { AccessibilityCloudAPIFeatureCollectionResult } from '../../lib/fetchers/ac/AccessibilityCloudAPIFeatureCollectionResult'

interface FeaturePanelContextType {
  features: {
    id: string,
    primaryFeature?: AnyFeature,
    additionalData?: AccessibilityCloudAPIFeatureCollectionResult<TypeTaggedPlaceInfo>
  }[]
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
  { featureIds?: string[], children: ReactNode },
) {
  const { query: { placeType, id: idOrIds } } = useAppStateAwareRouter()
  const baseFeatureUrl = `/${placeType}/${idOrIds}`

  const ids = useMemo(() => (
    Array.isArray(idOrIds) ? idOrIds : idOrIds?.split(',') ?? []
  ), [idOrIds])
  const featureIds = passedFeatureIds ?? buildFeatureIds(String(placeType), ids)

  const expandedFeatures = useExpandedFeatures(featureIds, {
    manyFeaturesSWRConfig: { shouldRetryOnError: false },
    sameAsSWRConfig: { shouldRetryOnError: false },
  })
  const { isLoading, isValidating } = expandedFeatures
  const anyData = (expandedFeatures.sameAs.data ?? expandedFeatures.manyFeatures.data)

  const resultSet = collectExpandedFeaturesResult(featureIds, expandedFeatures)
  const isBusy = (isLoading || isValidating) && !anyData
  const contextValue = useMemo(() => ({
    features: featureIds.map((x) => ({
      id: x,
      primaryFeature: resultSet[x]?.original,
      additionalData: resultSet[x]?.sameAs,
    })),
    isLoading: isBusy,
    error: false,
    baseFeatureUrl,
  }), [featureIds, isBusy, baseFeatureUrl, resultSet])

  return (
    <FeaturePanelContext.Provider value={contextValue}>
      {(false && !isBusy) && <ErrorToolBar />}
      {isBusy && (
        <StyledLoadingDiv className="_loading">
          <Spinner size={50} />
          <p className="_title">{t`Loading further details…`}</p>
        </StyledLoadingDiv>
      )}
      {(!isBusy && !false) && children}
    </FeaturePanelContext.Provider>
  )
}
