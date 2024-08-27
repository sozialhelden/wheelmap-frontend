import { useRouter } from 'next/router'
import useSWR from 'swr'
import { ReactElement } from 'react'
import Layout from '../../../components/App/Layout'
import MappingEventPanel from '../../../components/MappingEvents/MappingEventPanel'
import { useCurrentAppToken } from '../../../lib/context/AppContext'
import fetchMappingEvent from '../../../lib/fetchers/fetchMappingEvent'
import { MappingEventMetadata } from '../../../components/MappingEvents/MappingEventMetadata'

export default function Page() {
  const router = useRouter()
  const { id } = router.query
  const appToken = useCurrentAppToken()

  const { data: mappingEvent, isValidating, error } = useSWR(
    [appToken, id],
    fetchMappingEvent,
  )

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
