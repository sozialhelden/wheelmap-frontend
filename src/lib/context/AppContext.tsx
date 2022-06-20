import React from "react";
import { App } from "../model/App";

export const AppContext = React.createContext<App | undefined>(null);

export function useCurrentApp() {
  return React.useContext(AppContext);
}
