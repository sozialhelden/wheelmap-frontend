import type { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { type AppState, config } from "~/modules/app-state/app-state";
import { getAppStateFromSearchParams } from "~/modules/app-state/utils/app-state";
import { persistAppState } from "~/modules/app-state/utils/persistance";
import {
  getQuery,
  getQueryFromAppState,
} from "~/modules/app-state/utils/query";
import { addQueryParamsToUrl } from "~/utils/url";

type AppStateContextType = {
  appState: AppState;
  setAppState: (
    newState: Partial<AppState>,
    options?: NavigateOptions & {
      routerOperation?: "replace" | "push" | "shallow";
      keepExistingQuery?: boolean;
    },
  ) => void;
};

const AppStateContext = createContext<AppStateContextType>({
  appState: {} as AppState,
  setAppState: (newState, options) => {},
});

export function AppStateContextProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname() || "/";
  const query = useMemo(() => getQuery(searchParams), [searchParams]);

  const appState: AppStateContextType["appState"] = useMemo(
    () => getAppStateFromSearchParams(searchParams),
    [searchParams],
  );

  const setAppState = useCallback<AppStateContextType["setAppState"]>(
    (newState, options?) => {
      const { routerOperation, keepExistingQuery, ...navigateOptions } =
        options || {};

      let url = new URL(
        (keepExistingQuery ?? true)
          ? `${pathName}?${searchParams?.toString()}`
          : pathName,
        window.location.origin,
      );

      url = addQueryParamsToUrl(
        url,
        getQueryFromAppState({ ...appState, ...newState }),
      );

      if (!routerOperation || routerOperation === "push") {
        router.push(url.toString(), navigateOptions);
      } else if (routerOperation === "replace") {
        router.replace(url.toString(), navigateOptions);
      } else if (
        routerOperation === "shallow" &&
        url.toString() !== window.location.pathname
      ) {
        window.history.replaceState(null, document.title, url);
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
    // On mount, make sure to set the current app-state once,
    // so url parameters are added
    setAppState(appState, {
      keepExistingQuery: false,
      routerOperation: "shallow",
    });
  }, []);

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
