import { useRouter } from 'next/router'

function Equipment() {
  const router = useRouter()
  const { placeType, id, equipmentId } = router.query

  console.log(router.query)
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
