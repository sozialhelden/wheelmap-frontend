import { type Category, getCategories } from "@sozialhelden/core";
import type { NestedRecord } from "~/utils/search-params";

export function parseCategoryQueryParameter(
  value: NestedRecord<string | undefined> | string | undefined,
): Category | undefined {
  if (
    typeof value !== "string" ||
    !Object.keys(getCategories()).includes(value)
  ) {
    return undefined;
  }
  return value as Category;
}
