import { useCategoryFilter } from "~/modules/categories/contexts/CategoryFilterContext";
import { useNeeds } from "~/modules/needs/contexts/NeedsContext";
import type { NestedRecord } from "~/utils/search-params";

export function useAccessibilityCloudFilterQuery(): NestedRecord<
  string | undefined
> {
  return {
    needs: useNeeds().selection,
    includeCategories: useCategoryFilter().category,
  };
}
