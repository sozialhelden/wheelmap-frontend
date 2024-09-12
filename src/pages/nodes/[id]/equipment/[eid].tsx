import { useRouter } from 'next/router'
import React, { ReactElement, useState } from 'react'
import MapLayout from '../../../../components/App/MapLayout'
import { CombinedFeaturePanel } from '../../../../components/CombinedFeaturePanel/CombinedFeaturePanel'
import Toolbar from '../../../../components/shared/Toolbar'
import MockedPOIDetails from '../../../../lib/fixtures/mocks/features/MockedPOIDetails'
import useDocumentSWR from '../../../../lib/fetchers/ac/useDocumentSWR'
// TODO clean up this page
function EquipmentInfoPage() {
  const router = useRouter()
  const { query, asPath } = router
  const { id, eid } = query

  const [equipment, setEquipment] = useState(null)
  const [place, setPlace] = useState(null)

  // mocked data
  // TODO remove
  const fallbackId = 'YdhxzsBRACZGcenCF'
  const equipmentInfoId = typeof eid === 'string' ? eid : eid.shift()
  const placeInfoId = typeof id === 'string' ? id : id.shift()

  const fallbackEquipmentResponse = useDocumentSWR({
    type: 'ac:EquipmentInfo',
    _id: fallbackId,
  })

  const equipmentResponse = useDocumentSWR({
    type: 'ac:EquipmentInfo',
    _id: equipmentInfoId,
  })
  const placeResponse = useDocumentSWR({
    type: 'ac:EquipmentInfo',
    _id: placeInfoId,
  })
  const fallbackplaceResponse = useDocumentSWR({
    type: 'ac:PlaceInfo',
    _id: '222RZF9r2AAzqBQXh',
  });
  React.useEffect(() => {
    console.log('rendered')
    const equipment = equipmentResponse.data
    const fallbackEquipment = fallbackEquipmentResponse.data
    const place = placeResponse.data
    const fallbackplace = fallbackplaceResponse.data
    place ? setPlace(place) : setPlace(fallbackplace)
    equipment ? setEquipment(equipment) : setEquipment(fallbackEquipment)
  }, [
    fallbackEquipmentResponse,
    equipmentResponse,
    placeResponse,
    fallbackplaceResponse,
  ])

  return (
    <>
      {equipment && (
        <Toolbar>
          <CombinedFeaturePanel
            features={[place, equipment]}
          />
        </Toolbar>
      )}
      <MockedPOIDetails feature={equipment} description={`${asPath}`} />
    </>
  )
}

export default EquipmentInfoPage

EquipmentInfoPage.getLayout = function getLayout(page: ReactElement) {
  return <MapLayout>{page}</MapLayout>
}
