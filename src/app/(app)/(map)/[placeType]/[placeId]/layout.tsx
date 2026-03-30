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

  // Listen for custom event when the same place is clicked while sidebar is closed
  useEffect(() => {
    const handlePlaceClicked = () => {
      setIsExpanded(true);
    };

    window.addEventListener("place-clicked", handlePlaceClicked);
    return () => {
      window.removeEventListener("place-clicked", handlePlaceClicked);
    };
  }, []);

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
