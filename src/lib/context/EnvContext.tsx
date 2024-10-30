import React from 'react'

export type EnvironmentVariables = Record<string, string | undefined>
const EnvContext = React.createContext<EnvironmentVariables>(global.process ? process.env : {})

export default EnvContext

export function useEnvContext() {
  const envFromContext = React.useContext(EnvContext)
  return (global.process) ? process.env : envFromContext
}
