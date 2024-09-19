import { ReactElement } from 'react'
import styled from 'styled-components'
import MapLayout from '../../../components/App/MapLayout'
import CloseLink from '../../../components/shared/CloseLink'
import { useAppStateAwareRouter } from '../../../lib/util/useAppStateAwareRouter'
import { MultiFeatureToolbar } from '../../../components/CombinedFeaturePanel/MultiFeatureToolbar'

const PositionedCloseLink = styled(CloseLink)`
  align-self: flex-start;
  margin-top: -8px;
  margin-right: 1px;
`
PositionedCloseLink.displayName = 'PositionedCloseLink'

export default function CompositeFeaturesPage() {
  const { query: { ids } } = useAppStateAwareRouter()

  return <MultiFeatureToolbar featureIds={ids} />
}

CompositeFeaturesPage.getLayout = function getLayout(page: ReactElement) {
  return <MapLayout>{page}</MapLayout>
}
