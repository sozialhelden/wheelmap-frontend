import { t } from 'ttag'
import { ReactElement } from 'react'
import { ReportOSM } from './osm-position'
import { useCurrentApp } from '../../../../lib/context/AppContext'
import PlaceLayout from '../../../../components/CombinedFeaturePanel/PlaceLayout'

const makeTitle = (appName: string) => t`Most places on ${appName} come from OpenStreetMap.`
const subtitle = t`You can change this place's information on OpenStreetMap directly`

function ReportOSMComment() {
  const app = useCurrentApp()

  return <ReportOSM title={makeTitle(app?.name ?? 'Wheelmap.org')} subtitle={subtitle} />
}

ReportOSMComment.getLayout = function getLayout(page: ReactElement) {
  return <PlaceLayout>{page}</PlaceLayout>
}

export default ReportOSMComment
