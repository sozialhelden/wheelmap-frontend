import { useRouter } from 'next/router'
import { log } from '../../../../lib/util/logger'
import { getLayout } from '../../../../components/App/MapLayout'

function UploadPhotoThanks() {
  const router = useRouter()
  const { placeType, id } = router.query

  log.log(router.query)
  return (
    <>
      <header />
      <h1>Upload Photo Thank You page</h1>
      <h2>{`id: ${id}, placeType: ${placeType}`}</h2>
    </>
  )
}

export default UploadPhotoThanks

UploadPhotoThanks.getLayout = getLayout
