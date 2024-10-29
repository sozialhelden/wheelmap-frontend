import { useRouter } from 'next/router'
import React, { useEffect, ReactElement } from 'react'
import { isFirstStart } from '../lib/util/savedState'
import { SearchButtonOrInput } from '../components/SearchPanel/SearchButtonOrInput'
import Layout from '../components/App/MapLayout'

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
  return <Layout>{page}</Layout>
}
