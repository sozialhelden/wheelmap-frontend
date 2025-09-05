import type {
  AppRouterInstance,
  NavigateOptions,
} from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useAppState } from "~/modules/app-state/hooks/useAppState";
import { getQueryFromAppState } from "~/modules/app-state/utils/query";
import { addQueryParamsToUrl } from "~/utils/url";

export function useAppStateAwareRouter() {
  const { appState } = useAppState();
  const { push: nextPush, replace: nextReplace, ...nextRouter } = useRouter();

  const push = useCallback(
    (
      url: URL | string,
      options?: NavigateOptions,
    ): ReturnType<AppRouterInstance["push"]> => {
      return nextPush(
        addQueryParamsToUrl(
          url,
          getQueryFromAppState(appState),
          false,
        ).toString(),
        { scroll: true, ...options },
      );
    },
    [nextPush, addQueryParamsToUrl, getQueryFromAppState],
  );

  const replace = useCallback(
    (
      url: URL | string,
      options?: NavigateOptions,
    ): ReturnType<AppRouterInstance["replace"]> => {
      return nextReplace(
        addQueryParamsToUrl(
          url,
          getQueryFromAppState(appState),
          false,
        ).toString(),
        { scroll: false, ...options },
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
