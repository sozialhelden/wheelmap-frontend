import React from 'react'

export type EnvironmentVariables = Record<string, string | undefined>;
const EnvContext = React.createContext<EnvironmentVariables>({})

export default EnvContext

export function useEnvContext() {
  return React.useContext(EnvContext)
}
