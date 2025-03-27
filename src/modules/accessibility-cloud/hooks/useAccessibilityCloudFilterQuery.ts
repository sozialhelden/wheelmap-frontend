import { useCategoryFilter } from "~/modules/categories/contexts/CategoryFilterContext";
import { useNeeds } from "~/modules/needs/contexts/NeedsContext";

export function useAccessibilityCloudFilterQuery(): Record<
  string,
  string | undefined
> {
  return {
    needs: useNeeds().selection,
    includeCategories: useCategoryFilter().category,
  };
}
