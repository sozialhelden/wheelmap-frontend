import type { ReactNode } from "react";
import { DesktopSidebar } from "~/components/Sheet/DesktopSidebar";
import { MobileSheet } from "~/components/Sheet/MobileSheet";
import { useSidebarOnDesktop } from "~/components/Sheet/useSidebarOnDesktop";

export function Sheet({
  children,
  scrollStops = [],
  isExpanded = false,
  onIsExpandedChanged,
  onShowSidebarChanged,
}: {
  children: ReactNode;
  scrollStops?: number[];
  isExpanded?: boolean;
  onIsExpandedChanged?: (isExpanded: boolean) => void;
  onShowSidebarChanged?: (showSidebar: boolean) => void;
}) {
  const { showSidebar } = useSidebarOnDesktop({ onShowSidebarChanged });

  return (
    <>
      {showSidebar && (
        <DesktopSidebar isExpanded={isExpanded}>{children}</DesktopSidebar>
      )}
      {!showSidebar && (
        <MobileSheet
          isExpanded={isExpanded}
          scrollStops={scrollStops}
          onIsExpandedChanged={onIsExpandedChanged}
        >
          {children}
        </MobileSheet>
      )}
    </>
  );
}
