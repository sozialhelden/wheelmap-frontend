import Link from 'next/link'
import type { ComponentProps } from 'react'
import { useAppStateAwareHref } from './useAppStateAwareHref'


export const AppStateLink = ({ href, ...props }: ComponentProps<typeof Link>) => {
  const extendedHref = useAppStateAwareHref(href)
  return <Link {...props} href={extendedHref} />
}


