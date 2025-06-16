import { type NextRouter, useRouter } from "next/router";
import { useCallback } from "react";
import { useAppState } from "~/modules/app-state/hooks/useAppState";
import { getQueryFromAppState } from "~/modules/app-state/utils/query";

export function useAppStateAwareRouter() {
  const { appState } = useAppState();
  const { push: nextPush, replace: nextReplace, ...nextRouter } = useRouter();

  const setAppStateQueryParameters = useCallback(
    (url: URL | string): URL => {
      const urlObject = new URL(url, window.location.origin);
      for (const [key, value] of Object.entries(
        getQueryFromAppState(appState),
      )) {
        if (!urlObject.searchParams.has(key)) {
          urlObject.searchParams.set(key, value);
        }
      }
      return urlObject;
    },
    [appState],
  );

  const push = useCallback(
    async (
      url: URL | string,
      as?: URL | string,
      options?: Parameters<NextRouter["push"]>[2],
    ): ReturnType<NextRouter["push"]> => {
      return nextPush(setAppStateQueryParameters(url), as, options);
    },
    [nextPush, setAppStateQueryParameters],
  );

  const replace = useCallback(
    async (
      url: URL | string,
      as?: URL | string,
      options?: Parameters<NextRouter["replace"]>[2],
    ): ReturnType<NextRouter["replace"]> => {
      return nextReplace(setAppStateQueryParameters(url), as, options);
    },
    [nextReplace, setAppStateQueryParameters],
  );

  return {
    ...nextRouter,
    push,
    replace,
    setAppStateQueryParameters,
  };
}
