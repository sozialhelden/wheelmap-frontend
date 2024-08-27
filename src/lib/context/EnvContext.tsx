import React from 'react'

const EnvContext = React.createContext<Record<string, string>>({})

export default EnvContext

export function useEnvContext() {
  return React.useContext(EnvContext)
}
