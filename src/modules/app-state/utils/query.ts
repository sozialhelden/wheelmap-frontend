import {
  type AppState,
  type AppStateKey,
  config,
} from "~/modules/app-state/app-state";
import {
  type NestedRecord,
  flattenToSearchParams,
} from "~/utils/search-params";

export function parseQuery(query: NestedRecord<string | undefined>): AppState {
  return Object.entries(config).reduce((acc, [key, { parser }]) => {
    const parsedValue = parser(query[key]);
    return parsedValue ? Object.assign(acc, { [key]: parsedValue }) : acc;
  }, {} as AppState);
}

export function getQueryFromAppState(state: AppState): Record<string, string> {
  const serializedState = Object.entries(config).reduce(
    (acc, [key, { serializer }]) => {
      return Object.assign(acc, {
        [key]: serializer
          ? // @ts-ignore
            serializer(state[key as AppStateKey])
          : state[key as AppStateKey],
      });
    },
    {} as Parameters<typeof flattenToSearchParams>[0],
  );
  return flattenToSearchParams(serializedState) as Record<string, string>;
}
