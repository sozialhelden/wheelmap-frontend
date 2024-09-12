import React, { ReactElement } from 'react'
import MapLayout from '../../components/App/MapLayout'
import MappingEventListPanel from '../../components/MappingEvents/MappingEventListPanel'

export default function Page() {
  return <MappingEventListPanel />
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <MapLayout>{page}</MapLayout>
}
