import Link from "next/link";
import { type ComponentProps, type Ref, forwardRef, useMemo } from "react";
import { useAppState } from "~/modules/app-state/hooks/useAppState";
import { getQueryFromAppState } from "~/modules/app-state/utils/query";
import { addQueryParamsToUrl } from "~/utils/url";
import type { AppState } from "../app-state";

export const AppStateAwareLink = forwardRef(
  (
    {
      href,
      newAppState,
      ...props
    }: ComponentProps<typeof Link> & {
      newAppState?: Partial<AppState>;
    },
    ref: Ref<HTMLAnchorElement>,
  ) => {
    const { appState } = useAppState();

    const extendedHref = useMemo(
      () =>
        addQueryParamsToUrl(
          href as URL | string,
          getQueryFromAppState({ ...appState, ...newAppState }),
          false,
        ),
      [href, appState, newAppState],
    );

    return <Link {...props} href={extendedHref} ref={ref} />;
  },
);
