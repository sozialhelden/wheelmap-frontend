import { useRouter } from 'next/router'
import React from 'react'
import { log } from '../../../../lib/util/logger'
import PlaceLayout from '../../../../components/CombinedFeaturePanel/PlaceLayout'
import { StyledReportView } from './index'

function ReportExternalPage() {
  const router = useRouter()
  const { placeType, id } = router.query

  log.log(router.query)
  return (
    <StyledReportView>
      <h1>Report External Page</h1>
      <h2>{`id: ${id}, placeType: ${placeType}`}</h2>
    </StyledReportView>
  )
}

export default ReportExternalPage

ReportExternalPage.getLayout = function getLayout(page) {
  return <PlaceLayout>{page}</PlaceLayout>
}
