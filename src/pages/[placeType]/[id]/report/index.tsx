import { useRouter } from 'next/router'
import React from 'react'
import { useCurrentApp } from '../../../../lib/context/AppContext'
import MailToSupportLegacy from '../../../../components/NodeToolbar/Report/MailToSupportLegacy'
import useUserAgent from '../../../../lib/context/UserAgentContext'
function Report() {
  // onOpenReportMode = () => {
  //   if (this.props.featureId) {
  //     this.setState({ modalNodeState: 'report' });
  //     trackModalView('report');
  //   }
  // };

  const router = useRouter()
  const { placeType, id } = router.query
  const app = useCurrentApp()
  const userAgent = useUserAgent();

  return (
    <div>

      <h1>
        Report Index Page: ID:
        {id}
      </h1>
      <h2>
        Report Index Page: Place Type:
        {placeType}
      </h2>
      <MailToSupportLegacy feature={{properties: { category: "none" }, geometry: { type: "Point", coordinates: [11, 15]}}}  featureId="id" category={{
        "_id": "none",
        synonyms: [],
        icon: "none",
        parentIds: []
      }} parentCategory={null} onClose={() => {}} userAgent={userAgent} />
    </div>
  )
}

export default Report
