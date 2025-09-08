import React, { createContext, type ReactNode, useContext } from "react";
import type { WhitelabelApp } from "~/types/whitelabel";

export const WhitelabelContext = createContext<WhitelabelApp | undefined>(
  undefined,
);

export function useWhitelabel() {
  return useContext(WhitelabelContext) as WhitelabelApp;
}

export function WhitelabelContextProvider({
  children,
  whitelabelConfig,
}: { children: ReactNode; whitelabelConfig: WhitelabelApp }) {
  return (
    <WhitelabelContext.Provider value={whitelabelConfig}>
      {children}
    </WhitelabelContext.Provider>
  );
}
