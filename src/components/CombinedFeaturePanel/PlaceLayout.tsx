import { ReactNode } from 'react'
import styled from 'styled-components'
import Toolbar from '../shared/Toolbar'
import { FeaturePanelContextProvider } from './FeaturePanelContext'
import ErrorBoundary from '../shared/ErrorBoundary'
import { useAppStateAwareRouter } from '../../lib/util/useAppStateAwareRouter'
import CloseLink from '../shared/CloseLink'
import { getLayout as getMapLayout } from '../App/MapLayout'

const PositionedCloseLink = styled(() => {
  const { push } = useAppStateAwareRouter()
  return <CloseLink onClick={() => push('/')} />
})`
  align-self: flex-start;
  margin-top: -8px;
  margin-right: 1px;
`

PositionedCloseLink.displayName = 'PositionedCloseLink'

export default function PlaceLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <Toolbar>
      <PositionedCloseLink />
      <FeaturePanelContextProvider>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </FeaturePanelContextProvider>
    </Toolbar>
  )
}

export const getLayout = (page: ReactNode) => getMapLayout(<PlaceLayout>{page}</PlaceLayout>)
