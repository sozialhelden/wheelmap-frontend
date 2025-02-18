import React from "react";

type SidebarContextType = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const SidebarContext = React.createContext<SidebarContextType>({
  isOpen: true,
  open() {},
  close() {},
  toggle() {},
});
export default SidebarContext;

SidebarContext.displayName = "SidebarContext";

export function SidebarContextProvider({ children }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(!isOpen);

  const values = {
    isOpen,
    open,
    close,
    toggle,
  };
  return (
    <SidebarContext.Provider value={values}>{children}</SidebarContext.Provider>
  );
}

export function useSidebarContext() {
  return React.useContext(SidebarContext);
}
