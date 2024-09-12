import { useRouter } from 'next/router'
import React, { ReactElement } from 'react'
import MapLayout from '../../components/App/MapLayout'
import { useCurrentApp } from '../../lib/context/AppContext'
import { RossmannNode } from '../../lib/fixtures/mocks/nodes/rossmann'
import { CombinedFeaturePanel } from '../../components/CombinedFeaturePanel/CombinedFeaturePanel'

import Toolbar from '../../components/shared/Toolbar'
import MockedPOIDetails from '../../lib/fixtures/mocks/features/MockedPOIDetails'

function NodePage(props) {
  const router = useRouter()
  const { id } = router.query
  const app = useCurrentApp()

  return (
    <>
      <Toolbar>
        <CombinedFeaturePanel features={[RossmannNode]} />
      </Toolbar>
      <MockedPOIDetails feature={RossmannNode} description={`Node: ${id}`} />
    </>
  )
}

NodePage.getLayout = function getLayout(page: ReactElement) {
  return <MapLayout>{page}</MapLayout>
}

export default NodePage
