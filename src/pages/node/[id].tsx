import { ReactElement } from 'react'
import styled from 'styled-components'
import MapLayout from '../../components/App/MapLayout'
import { CombinedFeaturePanel } from '../../components/CombinedFeaturePanel/CombinedFeaturePanel'
import CloseLink from '../../components/shared/CloseLink'
import Toolbar from '../../components/shared/Toolbar'
import { useMultipleFeatures } from '../../lib/fetchers/fetchMultipleFeatures'
import { AnyFeature } from '../../lib/model/geo/AnyFeature'
import { useAppStateAwareRouter } from '../../lib/util/useAppStateAwareRouter'

const PositionedCloseLink = styled(CloseLink)`
  align-self: flex-start;
  margin-top: -8px;
  margin-right: 1px;
`
PositionedCloseLink.displayName = 'PositionedCloseLink'

export default function NodeFeaturePage() {
  const { push, query: { placeType, id } } = useAppStateAwareRouter()
  const { data } = useMultipleFeatures(`${placeType}:${id}`)

  const filteredFeatures = data?.filter(Boolean) as AnyFeature[] | undefined

  return (
    <Toolbar>
      <PositionedCloseLink onClick={() => push('/')} />
      <CombinedFeaturePanel features={filteredFeatures || []} />
    </Toolbar>
  )
}

NodeFeaturePage.getLayout = function getLayout(page: ReactElement) {
  return <MapLayout>{page}</MapLayout>
}
