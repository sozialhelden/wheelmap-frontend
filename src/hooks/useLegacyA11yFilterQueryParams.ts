import { useRouter } from "next/router";
import { useEffect } from "react";
import {
  type NeedProperties,
  type NeedSelection,
  type Needs,
  settings,
} from "~/config/needs";
import { useAppStateAwareRouter } from "~/lib/util/useAppStateAwareRouter";

function matchesCurrentQuery(
  paramName: string,
  expected: string[] | Readonly<string[]>,
) {
  const { query } = useRouter();
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

// get default need-selection from legacy a11yfilter query params wheechair and toilet
export function useLegacyA11yFilterQueryParamsDefaultSelection(): {
  defaultSelection: NeedSelection;
} {
  const defaultSelection = Object.fromEntries(
    Object.entries(settings).map(
      ([category, { legacyQueryParamName, needs: categoryNeedList }]) => {
        const value = Object.entries(categoryNeedList).find(
          ([_, { legacyQueryParams }]: [string, NeedProperties]) =>
            matchesCurrentQuery(legacyQueryParamName, legacyQueryParams ?? []),
        );
        return [category, value?.[0]];
      },
    ),
  ) as NeedSelection;

  return { defaultSelection };
}

export function useLegacyA11yFilterQueryParams({ needs }: { needs: Needs }) {
  const router = useAppStateAwareRouter();

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    const queryParams = Object.fromEntries(
      Object.entries(needs).map(([category, { legacyQueryParams }]) => {
        return [
          settings[category].legacyQueryParamName,
          legacyQueryParams ?? "",
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
