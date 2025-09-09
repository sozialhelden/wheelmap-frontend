import { type Category, getCategories } from "@sozialhelden/core";
import type { AppState } from "~/modules/app-state/app-state";
import type { NestedRecord } from "~/utils/search-params";

export function parseCategoryQueryParameter(
  value: NestedRecord<string | undefined> | string | undefined,
): Category | "" | undefined {
  if (
    typeof value !== "string" ||
    !Object.keys(getCategories()).includes(value)
  ) {
    return undefined;
  }
  return value as Category;
}

export function getCategoryFilterState(appState: AppState) {
  const category = appState.category;
  const categoryProperties = category ? getCategories()[category] : undefined;
  const isFilteringActive = Boolean(categoryProperties);

  return {
    category,
    categoryProperties,
    isFilteringActive,
  };
}
