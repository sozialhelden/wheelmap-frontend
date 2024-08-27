import React, { ReactElement } from 'react'
import Layout from '../../components/App/Layout'
import MappingEventListPanel from '../../components/MappingEvents/MappingEventListPanel'

export default function Page() {
  return <MappingEventListPanel />
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
