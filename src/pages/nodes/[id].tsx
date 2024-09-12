import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import styled from 'styled-components'
import CloseLink from '../../components/shared/CloseLink'

import MapLayout from '../../components/App/MapLayout'
import Toolbar from '../../components/shared/Toolbar'

const PositionedCloseLink = styled(CloseLink)`
  align-self: flex-start;
  margin-top: -8px;
  margin-right: 1px;
`
PositionedCloseLink.displayName = 'PositionedCloseLink'

export default function LegacyNodePage() {
  const router = useRouter()
  const { id } = router.query
  const isOSMFeature = typeof id === 'string' && id.match(/-?\d+/)

  // const { data: acFeature, error: acError } = useSWR(isOSMFeature ? null : [id], fetchOnePlaceInfo);
  // const { data: osmFeature, error: osmError } = useSWR(isOSMFeature ? [id] : null, fetchOneOSMFeature);

  // if (error) {
  //   return <pre>{String(error)}</pre>
  // }

  // return (
  //   <>
  //     {feature && (
  //       <Toolbar>
  //         <CombinedFeaturePanel features={[feature]} />
  //       </Toolbar>
  //     )}
  //     <MockedPOIDetails
  //       feature={feature}
  //       description="PlaceOfInterestDetails page"
  //     />
  //   </>
  // )

  return (
    <MapLayout>
      <Toolbar>
        <div>TODO: Load place details from OSM / AC here or redirect</div>
      </Toolbar>
    </MapLayout>
  )
}

LegacyNodePage.getLayout = function getLayout(page: ReactElement) {
  return <MapLayout>{page}</MapLayout>
}
