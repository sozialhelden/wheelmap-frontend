import Link from "next/link";
import type { ComponentProps, Ref } from "react";
import React from "react";
import { useAppStateAwareHref } from "./useAppStateAwareHref";

export const AppStateLink = React.forwardRef(
  (
    { href, ...props }: ComponentProps<typeof Link>,
    ref: Ref<HTMLAnchorElement>,
  ) => {
    const extendedHref = useAppStateAwareHref(href);

    return <Link {...props} href={extendedHref} ref={ref} />;
  },
);
