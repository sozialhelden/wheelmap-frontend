import { type HotkeyConfig, useHotkeys } from "@blueprintjs/core";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import {
  createContext,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import useMeasure from "react-use-measure";
import styled from "styled-components";
import ToastContainer from "~/needs-refactoring/components/ToastContainer";
import TopBar from "~/components/header/TopBar";
import { useExpertMode } from "~/needs-refactoring/lib/useExpertMode";
import { isFirstStart } from "~/needs-refactoring/lib/util/savedState";
import LoadableMapView from "~/needs-refactoring/components/Map/LoadableMapView";
import ErrorBoundary from "~/needs-refactoring/components/shared/ErrorBoundary";
import HeadMetaTags from "~/needs-refactoring/components/App/HeadMetaTags";
import {
  SheetMountedContextProvider,
  useSheetMounted,
} from "~/components/sheet/useSheetMounted";

// onboarding is a bad candidate for SSR, as it dependently renders based on a local storage setting
// these diverge between server and client (see: https://nextjs.org/docs/messages/react-hydration-error)
const Onboarding = dynamic(
  () => import("~/needs-refactoring/components/Onboarding/OnboardingView"),
  {
    ssr: false,
  },
);

const Main = styled.main<{ $enablePaddingForSheet: boolean }>`
  height: 100%;
  box-sizing: border-box;
  padding-bottom: ${({ $enablePaddingForSheet }) => ($enablePaddingForSheet ? "var(--sheet-height-collapsed)" : "0")}
`;

export default function BaseMapLayout({
  children,
}: {
  children?: ReactNode;
  enablePaddingForSheet?: boolean;
}) {
  // const firstStart = isFirstStart();
  // const router = useRouter();
  // const isOnboardingVisible = firstStart || router.pathname === "/onboarding";

  // TODO: find a better place...
  const { toggleExpertMode } = useExpertMode();
  const expertModeHotkeys: HotkeyConfig[] = useMemo(
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

  const [containerRef, { width, height }] = useMeasure({ debounce: 100 });
  const { isSheetMounted } = useSheetMounted();

  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
  }, [isSheetMounted]);

  return (
    <ErrorBoundary>
      <HeadMetaTags />
      <TopBar />
      <Main ref={containerRef} $enablePaddingForSheet={isSheetMounted}>
        <LoadableMapView width={width} height={height} key="map" />
        <div style={{ zIndex: 2000 }}>{children}</div>
      </Main>
      <ToastContainer />
      {/*{isOnboardingVisible && <Onboarding />}*/}
    </ErrorBoundary>
  );
}

export const getLayout = (page: ReactNode) => (
  <BaseMapLayout>{page}</BaseMapLayout>
);
