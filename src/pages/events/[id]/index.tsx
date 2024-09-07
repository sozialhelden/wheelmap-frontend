import { useRouter } from 'next/router'
import useSWR from 'swr'
import { ReactElement } from 'react'
import Layout from '../../../components/App/Layout'
import MappingEventPanel from '../../../components/MappingEvents/MappingEventPanel'
import { useCurrentAppToken } from '../../../lib/context/AppContext'
import { MappingEventMetadata } from '../../../components/MappingEvents/MappingEventMetadata'
import fetchMappingEvents from '../../../lib/fetchers/ac/refactor-this/fetchMappingEvents'
import useDocumentSWR from '../../../lib/fetchers/ac/useDocumentSWR'
import { MappingEvent } from '../../../lib/model/ac/MappingEvent'

export default function Page() {
  const router = useRouter()
  const { id } = router.query
  const appToken = useCurrentAppToken()

  const { data: mappingEvent } = useDocumentSWR<MappingEvent>({
    rdfType: 'ac:MappingEvent',
    _id: String(id),
    cached: false,
  })

  if (!mappingEvent) {
    return null
  }

  return (
    <>
      <MappingEventMetadata mappingEvent={mappingEvent} />
      <MappingEventPanel mappingEvent={mappingEvent} />
    </>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
