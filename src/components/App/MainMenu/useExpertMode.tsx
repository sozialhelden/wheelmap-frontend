import { useHotkeys } from "@blueprintjs/core";
import { useState, useMemo, useCallback } from "react";

import React from 'react'

const ExpertModeContext = React.createContext<{ isExpertMode: boolean, toggleExpertMode: () => void }>({ isExpertMode: false, toggleExpertMode: () => {
  debugger
} });

export default ExpertModeContext

export function useExpertMode() {
  return React.useContext(ExpertModeContext);
}

export function ExpertModeContextProvider({ children, defaultValue = false }) {
  const [isExpertMode, setExpertMode] = useState(defaultValue);
  const toggleExpertMode = useCallback(() => {
    setExpertMode(() => !isExpertMode);
  }, [isExpertMode]);

  return <ExpertModeContext.Provider value={{ isExpertMode, toggleExpertMode }}>
    {children}
  </ExpertModeContext.Provider>;
}