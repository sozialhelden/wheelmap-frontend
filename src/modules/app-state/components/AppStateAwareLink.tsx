import Link from "next/link";
import { type ComponentProps, type Ref, forwardRef, useMemo } from "react";
import { useAppStateAwareRouter } from "~/modules/app-state/hooks/useAppStateAwareRouter";
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
    const { setAppStateQueryParameters } = useAppStateAwareRouter();

    const extendedHref = useMemo(
      () => setAppStateQueryParameters(href as URL | string, newAppState),
      [href, newAppState, setAppStateQueryParameters],
    );

    return <Link {...props} href={extendedHref} ref={ref} />;
  },
);
