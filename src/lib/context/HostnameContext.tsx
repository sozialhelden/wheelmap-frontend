import React from "react";

export const HostnameContext = React.createContext<string>("");
HostnameContext.displayName = "HostnameContext";

export default function useHostnameContext() {
  return React.useContext(HostnameContext);
}

export function HostnameContextProvider({ hostname, children }) {
  return (
    <HostnameContext.Provider value={hostname}>
      {children}
    </HostnameContext.Provider>
  );
}
