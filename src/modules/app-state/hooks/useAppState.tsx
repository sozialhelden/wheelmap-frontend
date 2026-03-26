import type { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { type AppState, config } from "~/modules/app-state/app-state";
import { getAppStateFromSearchParams } from "~/modules/app-state/utils/app-state";
import { persistAppState } from "~/modules/app-state/utils/persistence";
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

  // Revision counter: incremented when persist-only values change but the URL
  // stays the same, so that the useMemo below still recomputes appState from
  // localStorage.
  const [revision, setRevision] = useState(0);

  const appState: AppStateContextType["appState"] = useMemo(
    () => getAppStateFromSearchParams(searchParams),
    [searchParams, revision],
  );

  const setAppState = useCallback<AppStateContextType["setAppState"]>(
    (newState, options?) => {
      const { routerOperation, keepExistingQuery, ...navigateOptions } =
        options || {};

      const mergedState = { ...appState, ...newState };

      // Persist immediately so that persist-only values (whose serializer
      // returns undefined) are saved even when the URL does not change.
      persistAppState(mergedState);

      let url = new URL(
        (keepExistingQuery ?? true)
          ? `${pathName}?${searchParams?.toString()}`
          : pathName,
        window.location.origin,
      );

      url = addQueryParamsToUrl(url, getQueryFromAppState(mergedState));

      if (window.location.href === url.href) {
        // The URL didn't change, but persist-only values may have been
        // updated in localStorage above. Bump the revision counter so
        // the useMemo recomputes appState from localStorage.
        setRevision((r) => r + 1);
        return;
      }

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
