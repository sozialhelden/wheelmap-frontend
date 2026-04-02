"use client";

import { HotkeysProvider } from "@blueprintjs/core";
import type { ReactNode } from "react";
import TopBar from "~/app/(app)/_components/TopBar";
import { ExpertModeContextProvider } from "~/hooks/useExpertMode";
import { AppStateContextProvider } from "~/modules/app-state/hooks/useAppState";
import { NeedsContextProvider } from "~/modules/needs/contexts/NeedsContext";
import OnboardingView from "~/modules/onboarding/OnboardingView";
import ToastContainer from "~/needs-refactoring/components/ToastContainer";
import SWRConfigProvider from "~/needs-refactoring/lib/fetchers/SWRConfigProvider";

/**
 * Main app layout that includes the top navigation bar as well as hotkey handlers
 * and additional context providers for the app.
 */
export default function AppLayout({ children }: { children: ReactNode }) {
  // TODO: add back session provider

  return (
    <>
      <AppStateContextProvider>
        <NeedsContextProvider>
          <HotkeysProvider>
            <ExpertModeContextProvider>
              <SWRConfigProvider>
                <TopBar />
                <OnboardingView />
                {children}
              </SWRConfigProvider>
            </ExpertModeContextProvider>
          </HotkeysProvider>
        </NeedsContextProvider>
      </AppStateContextProvider>
      <ToastContainer />
    </>
  );
}
