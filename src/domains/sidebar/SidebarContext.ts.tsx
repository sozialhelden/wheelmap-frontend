import { createContext, useContext, useState } from "react";

type SheetContextType = {
  isExpanded: boolean;
  setIsExpanded: (isOpen: boolean) => void;
  showSidebar: boolean;
  setShowSidebar: (showSidebar: boolean) => void;
  expand: () => void;
  collapse: () => void;
  toggle: () => void;
};

const SheetContext = createContext<SheetContextType>({
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
  const [showSidebar, setShowSidebar] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const expand = () => setIsExpanded(true);
  const collapse = () => setIsExpanded(false);
  const toggle = () => setIsExpanded(!isExpanded);

  return (
    <SheetContext.Provider
      value={{
        isExpanded,
        showSidebar,
        setIsExpanded,
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
