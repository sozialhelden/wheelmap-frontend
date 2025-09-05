import { type ReactNode, createContext, useContext } from "react";

export type EnvironmentVariables = Record<string, string | undefined>;

export const EnvironmentContext = createContext<EnvironmentVariables>({});

export function useEnvironment() {
  return useContext(EnvironmentContext);
}

export function EnvironmentContextProvider({
  children,
  environmentVariables,
}: { children: ReactNode; environmentVariables: EnvironmentVariables }) {
  return (
    <EnvironmentContext.Provider value={environmentVariables}>
      {children}
    </EnvironmentContext.Provider>
  );
}
