import React from 'react'
import { IApp } from '../model/ac/App'

export const AppContext = React.createContext<IApp | undefined>(undefined)
AppContext.displayName = 'AppContext'

export function useCurrentApp() {
  const app = React.useContext(AppContext)
  if (!app) {
    throw new Error('useCurrentApp must be used within an AppProvider')
  }
  return app as IApp
}

export function useCurrentAppToken() {
  return useCurrentApp()?.tokenString
}
