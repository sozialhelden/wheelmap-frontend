import React from "react";
import { App } from "../model/ac/App";

export const AppContext = React.createContext<App | undefined>(null);
AppContext.displayName = "AppContext";

export function useCurrentApp() {
  return React.useContext(AppContext);
}

export function useCurrentAppToken() {
  return useCurrentApp().tokenString;
}
