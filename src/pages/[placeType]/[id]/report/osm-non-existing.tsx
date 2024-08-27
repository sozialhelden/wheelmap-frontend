import { useRouter } from 'next/router'

function ReportOSMPosition() {
  const router = useRouter()
  const { placeType, id } = router.query

  console.log(router.query)
  return (
    <>
      <header />
      <h1>Report Non Existing</h1>
      <h2>{`id: ${id}, placeType: ${placeType}`}</h2>
    </>
  )
}

export default ReportOSMPosition
