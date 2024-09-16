import { useRouter } from 'next/router'
import { log } from '../../../../lib/util/logger'

function WheelchairA11y() {
  const router = useRouter()
  const { placeType, id } = router.query

  log.log(router.query)
  return (
    <>
      <header />
      <h1>Wheelchair Accessibility of Place Page</h1>
      <h2>{`PlaceId: ${id}, placeType: ${placeType}`}</h2>
    </>
  )
}

export default WheelchairA11y
