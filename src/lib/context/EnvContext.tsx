import React from "react";
import { addToEnvironment, getEnvironment } from "~/lib/util/globalEnvironment";

export type EnvironmentVariables = Record<string, string | undefined>;
const EnvContext = React.createContext<EnvironmentVariables>(
  global.process ? process.env : {},
);

export default EnvContext;

export function useEnvContext() {
  const envFromContext = React.useContext(EnvContext);
  return global.process ? process.env : envFromContext;
}

export function EnvContextProvider({ children, environmentVariables }) {
  addToEnvironment(environmentVariables);
  const environment = getEnvironment();

  return (
    <EnvContext.Provider value={environment}>{children}</EnvContext.Provider>
  );
}
