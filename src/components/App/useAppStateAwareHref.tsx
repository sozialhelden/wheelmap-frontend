import { useMemo } from "react";
import {
  preserveSearchParams,
  useAppStateAwareRouter,
} from "../../lib/util/useAppStateAwareRouter";

export function useAppStateAwareHref(href: string | UrlObject) {
  const { searchParams, query } = useAppStateAwareRouter();
  const extendedHref = useMemo(
    () => preserveSearchParams(href, searchParams, query),
    [href, searchParams, query],
  );
  return extendedHref;
}
