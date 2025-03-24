import { type ReactNode, createContext, useContext } from "react";

export const HostnameContext = createContext<string>("");

export default function useHostnameContext() {
  return useContext(HostnameContext);
}

export function HostnameContextProvider({
  hostname,
  children,
}: { hostname: string; children: ReactNode }) {
  return (
    <HostnameContext.Provider value={hostname}>
      {children}
    </HostnameContext.Provider>
  );
}
