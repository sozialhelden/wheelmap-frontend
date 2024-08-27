import React from 'react';
import { IApp } from '../model/ac/App';

export const AppContext = React.createContext<IApp | undefined>(null);
AppContext.displayName = 'AppContext';

export function useCurrentApp() {
  return React.useContext(AppContext);
}

export function useCurrentAppToken() {
  return useCurrentApp().tokenString;
}
