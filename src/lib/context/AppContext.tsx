import React from "react";
import useSWR from "swr";
import type ResourceError from "~/lib/fetchers/ResourceError";
import fetchApp, {
  appIdForHostnameOrIPAddress,
} from "~/lib/fetchers/ac/fetchApp";
import { fetchDocumentWithTypeTag } from "~/lib/fetchers/ac/fetchDocument";
import useDocumentSWR from "~/lib/fetchers/ac/useDocumentSWR";
import { getAccessibilityCloudCollectionName } from "~/lib/model/typing/AccessibilityCloudTypeMapping";
import { useEnvironmentContext } from "~/modules/app/context/EnvironmentContext";
import useHostnameContext from "~/modules/app/context/HostnameContext";
import type { IApp } from "../model/ac/App";

export const AppContext = React.createContext<IApp | undefined>(undefined);
AppContext.displayName = "AppContext";

export function useAppContext() {
  const app = React.useContext(AppContext);
  if (!app) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return app as IApp;
}

export function useCurrentAppToken() {
  return useAppContext()?.tokenString;
}

export function AppContextProvider({ children }) {
  const {
    NEXT_PUBLIC_ACCESSIBILITY_CLOUD_APP_TOKEN: appToken,
    NEXT_PUBLIC_ACCESSIBILITY_CLOUD_BASE_URL: baseUrl,
  } = useEnvironmentContext();
  const hostname = useHostnameContext();

  if (!appToken || !baseUrl) {
    throw new Error(
      "Please provide NEXT_PUBLIC_ACCESSIBILITY_CLOUD_APP_TOKEN and NEXT_PUBLIC_ACCESSIBILITY_CLOUD_BASE_URL.",
    );
  }

  const { data, error, isLoading } = useSWR(
    {
      baseUrl,
      rdfType: "ac:App",
      _id: appIdForHostnameOrIPAddress(hostname),
      paramsString: `appToken=${appToken}`,
    },
    fetchDocumentWithTypeTag,
  );

  return (
    <AppContext.Provider value={data as IApp}>
      {!isLoading && !error && children}
    </AppContext.Provider>
  );
}
