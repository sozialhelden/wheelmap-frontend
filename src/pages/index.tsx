import { useRouter } from 'next/router'
import { ReactElement, useEffect } from 'react'
import MapLayout from '../components/App/MapLayout'
import { isFirstStart } from '../lib/util/savedState'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    if (isFirstStart()) {
      router.replace('/onboarding')
    }
  }, [router])

  return <></>
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <MapLayout>{page}</MapLayout>
}
