import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
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
