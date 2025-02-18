import { useRouter } from "next/router";
import "normalize.css";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { type HotkeyConfig, useHotkeys } from "@blueprintjs/core";
import { Flex, Theme, ThemePanel } from "@radix-ui/themes";
import { ThemeProvider } from "next-themes";
import dynamic from "next/dynamic";
import useMeasure from "react-use-measure";
import styled from "styled-components";
import { useSidebarContext } from "~/domains/sidebar/SidebarContext.ts";
import { AppContext } from "../../lib/context/AppContext";
import { useExpertMode } from "../../lib/useExpertMode";
import { isFirstStart } from "../../lib/util/savedState";
import { GlobalMapContextProvider } from "../Map/GlobalMapContext";
import LoadableMapView from "../Map/LoadableMapView";
import { MapFilterContextProvider } from "../Map/filter/MapFilterContext";
import TopBar from "../TopBar";
import ErrorBoundary from "../shared/ErrorBoundary";
import HeadMetaTags from "./HeadMetaTags";

// onboarding is a bad candidate for SSR, as it dependently renders based on a local storage setting
// these diverge between server and client (see: https://nextjs.org/docs/messages/react-hydration-error)
const Onboarding = dynamic(() => import("../Onboarding/OnboardingView"), {
  ssr: false,
});

const SidebarContainer = styled.div<{ $isOpen?: boolean }>`
  --toggle-button-width: 5.25rem;
  --sidebar-width: calc(calc(var(--search-bar-width) + var(--toggle-button-width)) + calc(var(--space-2) * 2));
  --sidebar-drag-handle-height: var(--space-6);
  
  box-sizing: border-box;
  padding-top: var(--topbar-height);
  display: grid;
  height: 100%;
  grid-template-rows: ${({ $isOpen }) => ($isOpen ? "auto auto" : "auto var(--sidebar-drag-handle-height)")};
  
  @media (min-width: 1025px) {
      transition: grid-template-columns 400ms ease-in-out;
      grid-template-columns: ${({ $isOpen }) => ($isOpen ? "var(--sidebar-width) auto" : "0 100%")};
  }
`;
const Sidebar = styled.div`
  padding: var(--space-2);
  box-sizing: border-box;
  height: 100%;
  background: var(--color-panel-solid);
  order: 2;
`;
const DragHandle = styled.div`
    cursor: grab;
    height: var(--sidebar-drag-handle-height);
    text-align: center;
    margin-top: calc(var(--space-2) * -1);
    &::before {
      content: "";
      display: inline-block;
      height: .25rem;
      width: 4rem;
      background: var(--gray-8);
      border-radius: 99px;
    }  
`;

const BlurLayer = styled.div<{ active: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(${(p) => (p.active ? "10" : "0")}px);
  pointer-events: ${(p) => (p.active ? "initial" : "none")};
`;

const StyledToastContainer = styled(ToastContainer)`
width: min(400px, 80vw);
  > .Toastify__toast > .Toastify__toast-body {
    > .Toastify__toast-icon {
      visibility: hidden;
      width: 0;
    }
  }
`;

export default function MapLayout({
  children,
  blur,
}: {
  children?: React.ReactNode;
  blur?: boolean;
}) {
  const app = React.useContext(AppContext);
  const { clientSideConfiguration } = app || {};
  const firstStart = isFirstStart();
  const router = useRouter();
  const isOnboardingVisible = firstStart || router.pathname === "/onboarding";

  const [containerRef, { width, height }] = useMeasure({ debounce: 100 });

  const { toggleExpertMode } = useExpertMode();
  const expertModeHotkeys: HotkeyConfig[] = React.useMemo(
    () => [
      {
        combo: "mod+e",
        global: true,
        label: "Toggle expert mode",
        onKeyDown: toggleExpertMode,
        allowInInput: false,
      },
    ],
    [toggleExpertMode],
  );
  useHotkeys(expertModeHotkeys);

  const { isOpen } = useSidebarContext();

  return (
    <ThemeProvider attribute="class">
      <Theme
        accentColor="indigo"
        grayColor="sand"
        radius="medium"
        scaling="100%"
        panelBackground="solid"
      >
        <ThemePanel defaultOpen={false} />
        <ErrorBoundary>
          <HeadMetaTags />
          <MapFilterContextProvider>
            <GlobalMapContextProvider>
              {clientSideConfiguration && (
                <TopBar clientSideConfiguration={clientSideConfiguration} />
              )}
              {isOnboardingVisible && <Onboarding />}
              <main style={{ height: "100%" }} ref={containerRef}>
                <SidebarContainer $isOpen={isOpen}>
                  <Sidebar>
                    <DragHandle />
                  </Sidebar>
                  <LoadableMapView width={width} height={height} key="map" />
                </SidebarContainer>

                <BlurLayer active={blur} style={{ zIndex: 1000 }} />
                <div style={{ zIndex: 2000 }}>{children}</div>
                <StyledToastContainer position="bottom-center" stacked />
              </main>
            </GlobalMapContextProvider>
          </MapFilterContextProvider>
        </ErrorBoundary>
      </Theme>
    </ThemeProvider>
  );
}

export const getLayout = (page: React.ReactNode) => (
  <MapLayout>{page}</MapLayout>
);
