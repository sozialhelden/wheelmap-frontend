import { useRouter } from 'next/router'
import { log } from '../../../../../lib/util/logger'
import { getLayout } from '../../../../../components/App/MapLayout'

function Equipment() {
  const router = useRouter()
  const { placeType, id, equipmentId } = router.query

  log.log(router.query)
  return (
    <>
      <header />
      <h1>Equipment</h1>
      <h2>{`PlaceId: ${id}, placeType: ${placeType}`}</h2>
      <h2>{`EquipmentId: ${equipmentId}`}</h2>
    </>
  )
}

export default Equipment

Equipment.getLayout = getLayout
