import Link from 'next/link'
import { ComponentProps, useMemo } from 'react'
import { preserveSearchParams, useAppStateAwareRouter } from '../../lib/util/useAppStateAwareRouter'

export const AppStateLink = ({ href, ...props }: ComponentProps<typeof Link>) => {
  const { searchParams } = useAppStateAwareRouter()

  const extendedHref = useMemo(() => preserveSearchParams(href, searchParams), [href, searchParams])
  return <Link {...props} href={extendedHref} />
}
