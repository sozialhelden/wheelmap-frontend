import { useRouter } from 'next/router'
import React, { ReactElement } from 'react'
import MapLayout from '../../components/App/MapLayout'
import { useCurrentApp } from '../../lib/context/AppContext'
import { exampleStreet } from '../../lib/fixtures/mocks/ways/exampleStreet'
import MockedPOIDetails from '../../lib/fixtures/mocks/features/MockedPOIDetails'

function WayPage(props) {
  const router = useRouter()
  const { id } = router.query
  const app = useCurrentApp()

  return (
    <MockedPOIDetails feature={exampleStreet} description={`Way: ${id}`} />
  )
}

WayPage.getLayout = function getLayout(page: ReactElement) {
  return <MapLayout>{page}</MapLayout>
}

export default WayPage
