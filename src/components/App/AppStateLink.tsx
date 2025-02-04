import Link from "next/link";
import { type ComponentProps, type Ref, useMemo } from "react";
import React from "react";
import {
  preserveSearchParams,
  useAppStateAwareRouter,
} from "~/lib/util/useAppStateAwareRouter";

export const AppStateLink = React.forwardRef(
  (
    { href, ...props }: ComponentProps<typeof Link>,
    ref: Ref<HTMLAnchorElement>,
  ) => {
    const { searchParams, query } = useAppStateAwareRouter();

    const extendedHref = useMemo(
      () => preserveSearchParams(href, searchParams, query),
      [href, searchParams, query],
    );

    return <Link {...props} href={extendedHref} ref={ref} />;
  },
);
