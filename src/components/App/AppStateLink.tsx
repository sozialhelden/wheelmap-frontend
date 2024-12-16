import Link from 'next/link'
import { type ComponentProps, useMemo } from 'react'
import { preserveSearchParams, useAppStateAwareRouter } from '../../lib/util/useAppStateAwareRouter'

export const AppStateLink = ({ href, ...props }: ComponentProps<typeof Link>) => {
  const { searchParams, query } = useAppStateAwareRouter()

  const extendedHref = useMemo(() => preserveSearchParams(href, searchParams, query), [href, searchParams, query])
  return <Link {...props} href={extendedHref} />
}
