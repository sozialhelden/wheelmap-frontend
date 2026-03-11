import type { ReadonlyURLSearchParams } from "next/navigation";
import { type AppState, config } from "~/modules/app-state/app-state";
import { getAppStateFromPersistence } from "~/modules/app-state/utils/persistence";
import { parseQuery } from "~/modules/app-state/utils/query";
import { unflattenSearchParams } from "~/utils/search-params";

export function getDefaultAppState(): AppState {
  return Object.entries(config).reduce((acc, [key, { defaultValue }]) => {
    return defaultValue ? Object.assign(acc, { [key]: defaultValue }) : acc;
  }, {} as AppState);
}

export function getAppStateFromSearchParams(
  searchParams: URLSearchParams | ReadonlyURLSearchParams,
  includePersistence = true,
): AppState {
  const query = unflattenSearchParams(
    Object.fromEntries(searchParams?.entries() ?? []),
  );

  return {
    ...getDefaultAppState(),
    ...(includePersistence ? getAppStateFromPersistence() : {}),
    ...parseQuery(query),
  };
}
