import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { isFirstStart } from '../lib/util/savedState'
import { SearchButtonOrInput } from '../components/SearchPanel/SearchButtonOrInput'
import { ReactElement } from 'react'
import Layout from '../components/App/Layout'

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
