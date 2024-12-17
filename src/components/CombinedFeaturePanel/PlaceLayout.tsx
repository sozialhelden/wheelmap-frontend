import type { ReactNode } from 'react'
import styled from 'styled-components'
import type { Url } from 'next/dist/shared/lib/router/router'
import Toolbar from '../shared/Toolbar'
import { FeaturePanelContextProvider } from './FeaturePanelContext'
import ErrorBoundary from '../shared/ErrorBoundary'
import { useAppStateAwareRouter } from '../../lib/util/useAppStateAwareRouter'
import { getLayout as getMapLayout } from '../App/MapLayout'
import { IconButton } from '@radix-ui/themes'
import { Cross1Icon } from '@radix-ui/react-icons'
import { AppStateLink } from '../App/AppStateLink'

const PositionedCloseLink = styled(({ to }: { to?: Url }) => {
  const { push } = useAppStateAwareRouter()
  return <CloseLink onClick={() => push(to ?? '/')} />
})`
  align-self: flex-start;
  margin-top: -8px;
  margin-right: 1px;
`

PositionedCloseLink.displayName = 'PositionedCloseLink'

export default function PlaceLayout({
  children,
  closeUrl,
}: {
  children: ReactNode,
  closeUrl?: Url
}) {
  return (
    <Toolbar>
      <AppStateLink href={closeUrl ?? '/'}>
        <IconButton variant="ghost">
          <Cross1Icon />
        </IconButton>
      </AppStateLink>
      <FeaturePanelContextProvider>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </FeaturePanelContextProvider>
    </Toolbar>
  )
}

export const getLayout = (page: ReactNode) => getMapLayout(<PlaceLayout>{page}</PlaceLayout>)
