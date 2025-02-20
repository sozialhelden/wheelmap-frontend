import { type ReactNode, useEffect } from "react";
import { useSheetContext } from "~/domains/sheet/SheetContext.tsx";
import { DesktopSidebar } from "~/domains/sheet/components/DesktopSidebar";
import { MobileSheet } from "~/domains/sheet/components/MobileSheet";

export function Sheet({
  children,
  scrollStops = [],
}: {
  children: ReactNode;
  scrollStops?: number[];
}) {
  const {
    isExpanded,
    setIsExpanded,
    showSidebar,
    setShowSidebar,
    setIsMounted,
  } = useSheetContext();

  const handleResize = () => {
    setShowSidebar(window.matchMedia("(min-width: 769px)").matches);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  return (
    <>
      {showSidebar && (
        <DesktopSidebar isExpanded={isExpanded}>{children}</DesktopSidebar>
      )}
      {!showSidebar && (
        <MobileSheet
          scrollStops={scrollStops}
          isExpanded={isExpanded}
          onIsExpandedChanged={setIsExpanded}
        >
          {children}
        </MobileSheet>
      )}
    </>
  );
}
