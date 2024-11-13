import { useRouter } from 'next/router'
import React, { ReactElement } from 'react'
import MapLayout, { getLayout } from '../../../components/App/MapLayout'
import MappingEventWelcomeDialog from '../../../components/MappingEvents/MappingEventWelcomeDialog'

export default function Page() {
  const router = useRouter()
  const { id, invitationToken } = router.query

  return (
    <MappingEventWelcomeDialog
      invitationToken={invitationToken && String(invitationToken)}
      mappingEventId={id && String(id)}
    />
  )
}

Page.getLayout = getLayout
