import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAppStateAwareRouter } from "~/needs-refactoring/lib/util/useAppStateAwareRouter";
import {
  type NeedProperties,
  type NeedSelection,
  type Needs,
  settings,
} from "~/modules/needs/needs";

function matchesQuery(
  query: Record<string, string | string[] | undefined>,
  paramName: string,
  expected: string[] | Readonly<string[]>,
) {
  let value = query[paramName];

  // if a query parameter is present but not set it should match
  // with no-needs. if it is not present, the value is undefined,
  // and it should not match with anything
  if (value === "") {
    value = [];
  }

  return (
    JSON.stringify(expected) ===
    JSON.stringify(Array.isArray(value) ? value : [value])
  );
}

// get need-selection from legacy a11y query params wheelchair and toilet
export function useSelectionFromLegacyA11yQueryParams():
  | NeedSelection
  | undefined {
  const { query } = useRouter();

  const selection = Object.entries(settings).reduce(
    (acc, [category, { legacyQueryParamName, needs }]) => {
      acc[category] = Object.entries(needs)
        .find(([_, { legacyQueryParamValues }]: [string, NeedProperties]) =>
          matchesQuery(
            query,
            legacyQueryParamName,
            legacyQueryParamValues ?? [],
          ),
        )
        ?.shift();
      return acc;
    },
    {} as NeedSelection,
  );
  if (Object.values(selection).filter(Boolean).length > 0) {
    return selection;
  }
  return undefined;
}

// sync the given needs with the legacy a11y query params wheelchair and toilet
export function useSyncWithLegacyA11yQueryParams({ needs }: { needs: Needs }) {
  const router = useAppStateAwareRouter();

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    const queryParams = Object.fromEntries(
      Object.entries(needs).map(([category, { legacyQueryParamValues }]) => {
        return [
          settings[category].legacyQueryParamName,
          legacyQueryParamValues ?? "",
        ];
      }),
    );
    const queryHasChanged = Object.entries(queryParams).find(
      ([param, value]) => {
        const queryValue = router.query[param];
        return (
          JSON.stringify(
            Array.isArray(queryValue) ? queryValue : [queryValue],
          ) !== JSON.stringify(value)
        );
      },
    );
    if (queryHasChanged) {
      router.push({ query: queryParams });
    }
  }, [needs]);
}
