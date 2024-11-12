import React, {
  createContext, FC, ReactNode, useMemo, useRef,
} from 'react'
import { t } from 'ttag'
import styled from 'styled-components'
import Spinner from '../ActivityIndicator/Spinner'
import { useAppStateAwareRouter } from '../../lib/util/useAppStateAwareRouter'
import { rolloutOsmFeatureIds } from '../../lib/model/osm/rolloutOsmFeatureIds'
import { useExpandedFeatures } from '../../lib/fetchers/useFeatures'
import { isOSMElementValue, isOSMId } from '../../lib/typing/discriminators/osmDiscriminator'
import { normalizeOSMId } from '../../lib/typing/normalization/osmIdNormalization'
import { isAccessibilityCloudId } from '../../lib/typing/discriminators/isAccessibilityCloudId'
import { CollectedFeature, collectExpandedFeaturesResult } from '../../lib/fetchers/useFeatures/collectExpandedFeatures'

interface FeaturePanelContextType {
  features: {
    id: string,
    feature?: CollectedFeature
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

const normalizeIds = (ids: string[]) => ids.flatMap((x) => {
  if (isOSMId(x)) {
    if (isOSMElementValue(x)) {
      return [normalizeOSMId(x, 'amenities'), normalizeOSMId(x, 'buildings')]
    }
    return normalizeOSMId(x)
  }

  if (isAccessibilityCloudId(x)) {
    return x
  }
  console.warn(`FeatureID could not be categorized, was: '${x}'`)
  return undefined
}).filter((x) => !!x)

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

  const normalizedIds = normalizeIds(featureIds)
  const expandedFeatures = useExpandedFeatures(normalizedIds, {
    useFeaturesSWRConfig: { shouldRetryOnError: false },
    useOsmToAcSWRConfig: { shouldRetryOnError: false },
  })
  const { isLoading, isValidating } = expandedFeatures
  // eslint-disable-next-line max-len, @stylistic/js/max-len
  const anyData = (expandedFeatures.requestedFeatures.data ?? expandedFeatures.additionalOsmFeatures.data ?? expandedFeatures.additionalAcFeatures.data)

  const resultSet = collectExpandedFeaturesResult(normalizedIds, expandedFeatures)
  const isBusy = (isLoading || isValidating) && !anyData
  const contextValue = useMemo(() => ({
    features: resultSet.features.map((x, i) => ({
      id: normalizeIds[i],
      feature: x,
    })),
    isLoading: isBusy,
    error: false,
    baseFeatureUrl,
  }), [isBusy, baseFeatureUrl, resultSet])

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
