import { useRouter } from 'next/router'
import styled from 'styled-components'
import { ReactElement } from 'react'
import useSWR from 'swr'
import CloseLink from '../../components/shared/CloseLink'
import {
  fetchOnePlaceInfo,
} from '../../lib/fetchers/fetchOnePlaceInfo'

import Layout from '../../components/App/Layout'
import { CombinedFeaturePanel } from '../../components/CombinedFeaturePanel/CombinedFeaturePanel'
import Toolbar from '../../components/shared/Toolbar'
import { useCurrentApp } from '../../lib/context/AppContext'
import { useEnvContext } from '../../lib/context/EnvContext'
import MockedPOIDetails from '../../lib/fixtures/mocks/features/MockedPOIDetails'

const PositionedCloseLink = styled(CloseLink)`
  align-self: flex-start;
  margin-top: -8px;
  margin-right: 1px;
`
PositionedCloseLink.displayName = 'PositionedCloseLink'

export default function Nodes() {
  const router = useRouter()
  const { id } = router.query
  const app = useCurrentApp()
  const env = useEnvContext()
  const baseUrl = env.NEXT_PUBLIC_OSM_API_BACKEND_URL
  const { data: feature, error } = useSWR([app.tokenString, baseUrl, id], fetchOnePlaceInfo)

  if (error) {
    return <pre>{String(error)}</pre>
  }

  return (
    <>
      {feature && (
        <Toolbar>
          <CombinedFeaturePanel features={[feature]} />
        </Toolbar>
      )}
      <MockedPOIDetails
        feature={feature}
        description="PlaceOfInterestDetails page"
      />
    </>
  )
}

Nodes.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
