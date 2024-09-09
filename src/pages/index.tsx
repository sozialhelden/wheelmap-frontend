import { ReactElement } from 'react'
import Layout from '../components/App/Layout'

export default function Page() {
  return undefined
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
