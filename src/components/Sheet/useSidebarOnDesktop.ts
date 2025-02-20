import { useEffect, useState } from "react";

export function useSidebarOnDesktop({
  onShowSidebarChanged,
}: { onShowSidebarChanged?: (showSidebar: boolean) => void }): {
  showSidebar: boolean;
} {
  const [showSidebar, setShowSidebar] = useState(false);

  const calculate = () => {
    setShowSidebar(window.matchMedia("(min-width: 769px)").matches);
  };

  useEffect(() => {
    calculate();
    window.addEventListener("resize", calculate);
    return () => window.removeEventListener("resize", calculate);
  }, []);

  useEffect(() => onShowSidebarChanged?.(showSidebar), [showSidebar]);

  return {
    showSidebar,
  };
}
