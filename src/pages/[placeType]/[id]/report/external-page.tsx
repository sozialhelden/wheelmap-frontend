import { useRouter } from 'next/router'
import { log } from '../../../../lib/util/logger'

function ReportExternalPage() {
  const router = useRouter()
  const { placeType, id } = router.query

  log.log(router.query)
  return (
    <>
      <header />
      <h1>Report External Page</h1>
      <h2>{`id: ${id}, placeType: ${placeType}`}</h2>
    </>
  )
}

export default ReportExternalPage
