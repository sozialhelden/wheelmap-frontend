"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { SidebarLayout } from "~/app/(app)/(map)/_components/SidebarLayout";
import { useAppStateAwareRouter } from "~/modules/app-state/hooks/useAppStateAwareRouter";
import { FeaturePanelContextProvider } from "~/needs-refactoring/components/CombinedFeaturePanel/FeaturePanelContext";

export default function PlaceLayout({ children }: { children: ReactNode }) {
  const { push } = useAppStateAwareRouter();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    setIsExpanded(true);
  }, [pathname]);

  return (
    <SidebarLayout
      isExpanded={isExpanded}
      onToggle={setIsExpanded}
      showCloseButton={true}
      onCloseButtonClick={() => push("/")}
      hasTopPadding={false}
    >
      <FeaturePanelContextProvider>{children}</FeaturePanelContextProvider>
    </SidebarLayout>
  );
}
