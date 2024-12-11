import React, { useState, useCallback } from "react";

type ExpertModeContextType = {
  isExpertMode: boolean;
  toggleExpertMode: () => void;
};
const defaultValue = { isExpertMode: false, toggleExpertMode: () => {} };
const ExpertModeContext =
  React.createContext<ExpertModeContextType>(defaultValue);

export default ExpertModeContext;

/**
 * @returns {ExpertModeContextType} Information if the user has enabled 'expert mode' in the app,
 * and a function to toggle this feature.
 */
export function useExpertMode() {
  return React.useContext(ExpertModeContext);
}

export function ExpertModeContextProvider({ children, defaultValue = false }) {
  const [isExpertMode, setExpertMode] = useState(defaultValue);
  const toggleExpertMode = useCallback(() => {
    setExpertMode(() => !isExpertMode);
  }, [isExpertMode]);

  return (
    <ExpertModeContext.Provider value={{ isExpertMode, toggleExpertMode }}>
      {children}
    </ExpertModeContext.Provider>
  );
}
