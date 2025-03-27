import { Flex, Spinner } from "@radix-ui/themes";
import React, {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
} from "react";
import useSWR from "swr";
import { appIdForHostnameOrIPAddress } from "~/needs-refactoring/lib/fetchers/ac/fetchApp";
import { fetchDocumentWithTypeTag } from "~/needs-refactoring/lib/fetchers/ac/fetchDocument";
import type { IApp } from "../model/ac/App";
import { useEnvironmentContext } from "~/modules/app/context/EnvironmentContext";
import useHostnameContext from "~/modules/app/context/HostnameContext";

export const AppContext = createContext<IApp | undefined>(undefined);
AppContext.displayName = "AppContext";

export function useAppContext() {
  return useContext(AppContext) as IApp;
}

export function AppContextProvider({ children }: { children: ReactNode }) {
  const {
    NEXT_PUBLIC_ACCESSIBILITY_CLOUD_APP_TOKEN: appToken,
    NEXT_PUBLIC_ACCESSIBILITY_CLOUD_BASE_URL: baseUrl,
  } = useEnvironmentContext();

  const hostname = useHostnameContext();

  if (!baseUrl) {
    throw new Error("Accessibility Cloud base url not set");
  }
  if (!appToken) {
    throw new Error("Accessibility Cloud app token not set");
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

  useEffect(() => {
    // TODO: replace with proper error handling later
    if (error) {
      throw new Error("Failed to fetch app data");
    }
  }, [error]);

  return (
    <AppContext.Provider value={data as IApp}>
      {!isLoading && !error && children}
      {isLoading && (
        <Flex width="100vw" height="100vh" justify="center" align="center">
          <Spinner size="3" />
        </Flex>
      )}
    </AppContext.Provider>
  );
}
