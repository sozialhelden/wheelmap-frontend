import type { ReadonlyURLSearchParams } from "next/navigation";
import {
  type AppState,
  type AppStateKey,
  config,
} from "~/modules/app-state/app-state";
import {
  type NestedRecord,
  unflattenSearchParams,
} from "~/utils/search-params";

export function getQuery(
  searchParams: URLSearchParams | ReadonlyURLSearchParams,
): NestedRecord<string | undefined> {
  return unflattenSearchParams(
    Object.fromEntries(searchParams?.entries() ?? []),
  );
}

export function parseQuery(query: NestedRecord<string | undefined>): AppState {
  return Object.entries(config).reduce((acc, [key, { parser }]) => {
    const parsedValue = parser(query[key]);
    return parsedValue ? Object.assign(acc, { [key]: parsedValue }) : acc;
  }, {} as AppState);
}

export function getQueryFromAppState(
  state: AppState,
): NestedRecord<string | undefined> {
  return Object.entries(config).reduce(
    (acc, [key, { serializer }]) => {
      return Object.assign(acc, {
        [key]: serializer
          ? // @ts-ignore
            serializer(state[key as AppStateKey])
          : state[key as AppStateKey],
      });
    },
    {} as NestedRecord<string | undefined>,
  );
}
