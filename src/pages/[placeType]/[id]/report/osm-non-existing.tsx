import { t } from 'ttag'
import { ReactElement } from 'react'
import { ReportOSM } from './osm-position'
import MapLayout from '../../../../components/App/MapLayout'

const disusedUrl = 'https://wiki.openstreetmap.org/wiki/Key:disused:*'
const title = t`You can remove non-existent places on OpenStreetMap.`
const sub = t`If the place has closed permanently, you can tag the place as 'disused' on OpenStreetMap. ([Find out how](${disusedUrl}))`

function ReportOSMNonExisting() {
  return (
    <ReportOSM title={title} subtitle={sub} />
  )
}

ReportOSMNonExisting.getLayout = function getLayout(page: ReactElement) {
  return <MapLayout>{page}</MapLayout>
}

export default ReportOSMNonExisting
