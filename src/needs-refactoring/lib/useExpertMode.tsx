import { useState, createContext, useContext, type ReactNode } from "react";

export type ExpertModeContextType = {
  isExpertMode: boolean;
  toggleExpertMode: () => void;
};

export const ExpertModeContext = createContext<ExpertModeContextType>({
  isExpertMode: false,
  toggleExpertMode: () => {},
});

export function useExpertMode() {
  return useContext(ExpertModeContext);
}

export function ExpertModeContextProvider({
  children,
}: { children: ReactNode }) {
  const [isExpertMode, setExpertMode] = useState(false);
  const toggleExpertMode = () => {
    setExpertMode(() => !isExpertMode);
  };

  return (
    <ExpertModeContext.Provider value={{ isExpertMode, toggleExpertMode }}>
      {children}
    </ExpertModeContext.Provider>
  );
}
