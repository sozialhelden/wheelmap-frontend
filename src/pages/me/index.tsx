import React, { ReactElement } from 'react'
import MapLayout from '../../components/App/MapLayout'
import ProfilePanel from '../../components/Session/ProfilePanel'
import Toolbar from '../../components/shared/Toolbar'

export default function Page() {
  return (
    <Toolbar>
      <ProfilePanel />
    </Toolbar>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <MapLayout>{page}</MapLayout>
}
