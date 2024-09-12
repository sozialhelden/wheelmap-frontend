import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import styled from 'styled-components'
import MapLayout from '../../../components/App/MapLayout'
import { CombinedFeaturePanel } from '../../../components/CombinedFeaturePanel/CombinedFeaturePanel'
import CloseLink from '../../../components/shared/CloseLink'
import Toolbar from '../../../components/shared/Toolbar'
import { useMultipleFeatures } from '../../../lib/fetchers/fetchMultipleFeatures'

const PositionedCloseLink = styled(CloseLink)`
  align-self: flex-start;
  margin-top: -8px;
  margin-right: 1px;
`
PositionedCloseLink.displayName = 'PositionedCloseLink'

export default function CompositeFeaturesPage() {
  const router = useRouter()
  const { placeType, id } = router.query
  const features = useMultipleFeatures(`${placeType}:${id}`)

  const options = {
    handleOpenReportMode: () => router.push(`/${placeType}/${id}/report`),
  }

  return (
    <Toolbar>
      <CombinedFeaturePanel features={features.data || []} options={options} />
    </Toolbar>
  )
}

CompositeFeaturesPage.getLayout = function getLayout(page: ReactElement) {
  return <MapLayout>{page}</MapLayout>
}
