import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import '@blueprintjs/popover2/lib/css/blueprint-popover2.css'
import { useRouter } from 'next/router'
import 'normalize.css'
import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useMeasure from 'react-use-measure'
import styled from 'styled-components'
import dynamic from 'next/dynamic'
import { AppContext } from '../../lib/context/AppContext'
import LoadableMapView from '../MapNew/LoadableMapView'
import GlobalStyle from './GlobalAppStyle'
import HeadMetaTags from './HeadMetaTags'
import MainMenu from './MainMenu/MainMenu'
import ErrorBoundary from '../shared/ErrorBoundary'
import { GlobalMapContextProvider } from '../MapNew/GlobalMapContext'
import { isFirstStart } from '../../lib/util/savedState'
import { MapFilterContextProvider } from '../MapNew/filter/MapFilterContext'

// onboarding is a bad candidate for SSR, as it dependently renders based on a local storage setting
// these diverge between server and client (see: https://nextjs.org/docs/messages/react-hydration-error)
const Onboarding = dynamic(() => import('../Onboarding/OnboardingView'), { ssr: false })

const BlurLayer = styled.div<{ active: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(${(p) => (p.active ? '10' : '0')}px);
  pointer-events: ${(p) => (p.active ? 'initial' : 'none')};
`

const StyledToastContainer = styled(ToastContainer)`
width: min(400px, 80vw);
  > .Toastify__toast > .Toastify__toast-body {
    > .Toastify__toast-icon {
      visibility: hidden;
      width: 0;
    }
  }
`

export default function MapLayout({
  children,
  blur,
}: {
  children?: React.ReactNode;
  blur?: boolean;
}) {
  const app = React.useContext(AppContext)
  const { clientSideConfiguration } = app || {}
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const firstStart = isFirstStart()
  const toggleMainMenu = React.useCallback((newValue?: boolean) => {
    setIsMenuOpen(typeof newValue === 'boolean' ? newValue : !isMenuOpen)
  }, [isMenuOpen])

  const [containerRef, { width, height }] = useMeasure({ debounce: 100 })

  const router = useRouter()
  const { pathname } = router
  React.useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  return (
    <ErrorBoundary>
      <MapFilterContextProvider>
        {firstStart && <Onboarding />}
        <HeadMetaTags />
        <GlobalStyle />
        <GlobalMapContextProvider>
          <MainMenu
            onToggle={toggleMainMenu}
            isOpen={isMenuOpen}
            clientSideConfiguration={clientSideConfiguration}
          />
          <main
            style={{ height: '100%' }}
            ref={containerRef}
          >
            <LoadableMapView {...{ width, height }} />
            <BlurLayer active={blur} style={{ zIndex: 1000 }} />
            <div style={{ zIndex: 2000 }}>{children}</div>
            <StyledToastContainer position="bottom-center" stacked />
          </main>
        </GlobalMapContextProvider>
      </MapFilterContextProvider>
    </ErrorBoundary>
  )
}
