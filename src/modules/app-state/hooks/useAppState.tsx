import { type NextRouter, useRouter } from "next/router";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { type AppState, config } from "~/modules/app-state/app-state";
import {
  getAppStateFromPersistence,
  persistAppState,
} from "~/modules/app-state/utils/persistance";
import {
  getQueryFromAppState,
  parseQuery,
} from "~/modules/app-state/utils/query";
import { unflattenSearchParams } from "~/utils/search-params";
import { addQueryParamsToUrl } from "~/utils/url";

type AppStateContextType = {
  appState: AppState;
  setAppState: (
    newState: Partial<AppState>,
    options?: Parameters<NextRouter["push"]>[2] & {
      routerOperation?: "replace" | "push";
      keepExistingQuery?: boolean;
    },
  ) => Promise<void>;
};

const AppStateContext = createContext<AppStateContextType>({
  appState: {} as AppState,
  setAppState: async (newState, options) => {},
});

function getDefaultAppState(): AppState {
  return Object.entries(config).reduce((acc, [key, { defaultValue }]) => {
    return defaultValue ? Object.assign(acc, { [key]: defaultValue }) : acc;
  }, {} as AppState);
}

export function AppStateContextProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const query = useMemo(
    () => unflattenSearchParams(router.query as Record<string, string>),
    [router.query],
  );

  const appState: AppStateContextType["appState"] = useMemo(
    () => ({
      ...getDefaultAppState(),
      ...getAppStateFromPersistence(),
      ...parseQuery(query),
    }),
    [query],
  );

  const setAppState = useCallback<AppStateContextType["setAppState"]>(
    async (newState, options?) => {
      let url = new URL(
        (options?.keepExistingQuery ?? true)
          ? router.asPath
          : router.asPath.split("?")[0],
        window.location.origin,
      );

      url = addQueryParamsToUrl(
        url,
        getQueryFromAppState({ ...appState, ...newState }),
      );

      if (!options?.routerOperation || options?.routerOperation === "push") {
        await router.push(url, undefined, options);
      } else {
        await router.replace(url, undefined, options);
      }
    },
    [appState, router],
  );

  useEffect(() => {
    const appStateFromLegacyQueryParameters = Object.entries(config).reduce(
      (acc, [key, { legacy }]) => {
        const legacyValue = legacy?.(query);
        return legacyValue ? Object.assign(acc, { [key]: legacyValue }) : acc;
      },
      {} as Partial<AppState>,
    );
    if (Object.keys(appStateFromLegacyQueryParameters).length > 0) {
      setAppState(appStateFromLegacyQueryParameters, {
        keepExistingQuery: false,
      });
    }
  });

  useEffect(() => {
    persistAppState(appState);
  }, [appState]);

  return (
    <AppStateContext.Provider
      value={{
        appState,
        setAppState,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  return useContext(AppStateContext);
}
