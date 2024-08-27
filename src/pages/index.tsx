import { useRouter } from 'next/router'
import MapLayout from '../components/App/MapLayout'
import React, { ReactElement, useEffect } from 'react'
import { isFirstStart } from '../lib/util/savedState'
import SearchButton from '../components/SearchPanel/SearchButton'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    if (isFirstStart()) {
      router.replace('/onboarding')
    }
  }, [router])

  return (
    <SearchButton />
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <MapLayout>{page}</MapLayout>
}
