import { type ReactNode, useContext, useEffect } from "react";
import { CategoryFilterContext } from "~/modules/categories/context/CategoryFilterContext";
import { useSheetContext } from "~/modules/sheet/SheetContext.tsx";
import { DesktopSidebar } from "~/modules/sheet/components/DesktopSidebar";
import { MobileSheet } from "~/modules/sheet/components/MobileSheet";

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
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
