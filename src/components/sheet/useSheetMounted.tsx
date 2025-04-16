import { createContext, useContext, useState, type ReactNode } from "react";

export type SheetMountedType = {
  isSheetMounted: boolean;
  setIsSheetMounted: (value: boolean) => void;
};

export const SheetContext = createContext<SheetMountedType>({
  isSheetMounted: false,
  setIsSheetMounted: () => {},
});

export function useSheetMounted() {
  return useContext(SheetContext);
}

export function SheetMountedContextProvider({
  children,
}: { children: ReactNode }) {
  const [isSheetMounted, setIsSheetMounted] = useState(false);

  return (
    <SheetContext.Provider value={{ isSheetMounted, setIsSheetMounted }}>
      {children}
    </SheetContext.Provider>
  );
}
