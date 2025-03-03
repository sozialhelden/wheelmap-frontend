import { createContext, useContext, useState } from "react";

type SheetContextType = {
  isMounted: boolean;
  setIsMounted: (isMounted: boolean) => void;
  isExpanded: boolean;
  setIsExpanded: (isOpen: boolean) => void;
  showSidebar: boolean;
  setShowSidebar: (showSidebar: boolean) => void;
  expand: () => void;
  collapse: () => void;
  toggle: () => void;
};

const SheetContext = createContext<SheetContextType>({
  isMounted: false,
  setIsMounted() {},
  isExpanded: true,
  setIsExpanded() {},
  showSidebar: true,
  setShowSidebar() {},
  expand() {},
  collapse() {},
  toggle() {},
});
export default SheetContext;
SheetContext.displayName = "SheetContext";

export function SheetContextProvider({ children }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const expand = () => setIsExpanded(true);
  const collapse = () => setIsExpanded(false);
  const toggle = () => setIsExpanded(!isExpanded);

  return (
    <SheetContext.Provider
      value={{
        isMounted,
        setIsMounted,
        isExpanded,
        setIsExpanded,
        showSidebar,
        setShowSidebar,
        expand,
        collapse,
        toggle,
      }}
    >
      {children}
    </SheetContext.Provider>
  );
}

export function useSheetContext() {
  return useContext(SheetContext);
}
