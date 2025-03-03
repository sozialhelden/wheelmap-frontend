import { useRouter } from "next/router";
import "normalize.css";
import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { type HotkeyConfig, useHotkeys } from "@blueprintjs/core";
import dynamic from "next/dynamic";
import useMeasure from "react-use-measure";
import styled from "styled-components";
import { AppContext } from "~/lib/context/AppContext";
import { useExpertMode } from "~/lib/useExpertMode";
import { isFirstStart } from "~/lib/util/savedState";
import { useSheetContext } from "~/modules/sheet/SheetContext";
import LoadableMapView from "../Map/LoadableMapView";
import TopBar from "../TopBar";
import ErrorBoundary from "../shared/ErrorBoundary";
import HeadMetaTags from "./HeadMetaTags";

// onboarding is a bad candidate for SSR, as it dependently renders based on a local storage setting
// these diverge between server and client (see: https://nextjs.org/docs/messages/react-hydration-error)
const Onboarding = dynamic(() => import("../Onboarding/OnboardingView"), {
  ssr: false,
});

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

const Main = styled.main<{ $enablePaddingForSheet: boolean }>`
  height: 100%;
  box-sizing: border-box;
  padding-bottom: ${({ $enablePaddingForSheet }) => ($enablePaddingForSheet ? "var(--sheet-height-collapsed)" : "0")}
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

  const { showSidebar, isMounted } = useSheetContext();
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
  }, [isMounted, showSidebar]);

  return (
    <ErrorBoundary>
      <HeadMetaTags />
          {clientSideConfiguration && (
            <TopBar clientSideConfiguration={clientSideConfiguration} />
          )}
          {isOnboardingVisible && <Onboarding />}
          <main $enablePaddingForSheet={isMounted && !showSidebar} ref={containerRef}>
            <LoadableMapView width={width} height={height} key="map" />
            <BlurLayer active={blur} style={{ zIndex: 1000 }} />
            <div style={{ zIndex: 2000 }}>{children}</div>
            {/*<StyledToastContainer position="bottom-center" stacked />*/}
          </main>
    </ErrorBoundary>
  );
}

export const getLayout = (page: React.ReactNode) => (
  <MapLayout>{page}</MapLayout>
);
