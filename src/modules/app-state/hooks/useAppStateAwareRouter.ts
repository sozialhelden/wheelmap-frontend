import { type NextRouter, useRouter } from "next/router";
import { useCallback } from "react";
import { useAppState } from "~/modules/app-state/hooks/useAppState";
import { getQueryFromAppState } from "~/modules/app-state/utils/query";
import { addQueryParamsToUrl } from "~/utils/url";

export function useAppStateAwareRouter() {
  const { appState } = useAppState();
  const { push: nextPush, replace: nextReplace, ...nextRouter } = useRouter();

  const push = useCallback(
    async (
      url: URL | string,
      as?: URL | string,
      options?: Parameters<NextRouter["push"]>[2],
    ): ReturnType<NextRouter["push"]> => {
      return nextPush(
        addQueryParamsToUrl(url, getQueryFromAppState(appState), false),
        as,
        options,
      );
    },
    [nextPush, addQueryParamsToUrl, getQueryFromAppState],
  );

  const replace = useCallback(
    async (
      url: URL | string,
      as?: URL | string,
      options?: Parameters<NextRouter["replace"]>[2],
    ): ReturnType<NextRouter["replace"]> => {
      return nextReplace(
        addQueryParamsToUrl(url, getQueryFromAppState(appState), false),
        as,
        options,
      );
    },
    [nextReplace, addQueryParamsToUrl, getQueryFromAppState],
  );

  return {
    ...nextRouter,
    push,
    replace,
  };
}
