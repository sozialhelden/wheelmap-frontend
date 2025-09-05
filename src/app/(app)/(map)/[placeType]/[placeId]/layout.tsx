"use client";

import type { ReactNode } from "react";
import { SidebarLayout } from "~/app/(app)/(map)/_components/SidebarLayout";
import { useAppStateAwareRouter } from "~/modules/app-state/hooks/useAppStateAwareRouter";
import { FeaturePanelContextProvider } from "~/needs-refactoring/components/CombinedFeaturePanel/FeaturePanelContext";

export default function PlaceLayout({ children }: { children: ReactNode }) {
  const { push } = useAppStateAwareRouter();

  return (
    <SidebarLayout
      defaultIsExpanded={true}
      showCloseButton={true}
      onCloseButtonClick={() => push("/")}
      hasTopPadding={false}
    >
      <FeaturePanelContextProvider>{children}</FeaturePanelContextProvider>
    </SidebarLayout>
  );
}
