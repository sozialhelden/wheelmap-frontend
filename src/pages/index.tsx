import { useRouter } from 'next/router'
import React, { ReactElement, useEffect } from 'react'
import MapLayout from '../components/App/MapLayout'
import { isFirstStart } from '../lib/util/savedState'
import { SearchButtonOrInput } from '../components/SearchPanel/SearchButtonOrInput'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    if (isFirstStart()) {
      router.replace('/onboarding')
    }
  }, [router])

  return (
    <SearchButtonOrInput />
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <MapLayout>{page}</MapLayout>
}
