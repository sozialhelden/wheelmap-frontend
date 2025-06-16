import Link from "next/link";
import { type ComponentProps, type Ref, forwardRef, useMemo } from "react";

import { useAppStateAwareRouter } from "~/modules/app-state/hooks/useAppStateAwareRouter";

export const AppStateLink = forwardRef(
  (
    { href, ...props }: ComponentProps<typeof Link>,
    ref: Ref<HTMLAnchorElement>,
  ) => {
    const { setAppStateQueryParameters } = useAppStateAwareRouter();

    const extendedHref = useMemo(
      () => setAppStateQueryParameters(href as URL | string),
      [href, setAppStateQueryParameters],
    );

    return <Link {...props} href={extendedHref} ref={ref} />;
  },
);
