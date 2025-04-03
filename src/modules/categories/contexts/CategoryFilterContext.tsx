import { type ReactNode, createContext, useContext, useMemo } from "react";
import { useAppStateAwareRouter } from "~/needs-refactoring/lib/util/useAppStateAwareRouter";
import {
  type Category,
  type CategoryProperties,
  categories,
} from "~/modules/categories/categories";

export type CategoryFilterContextType = {
  isFilteringActive: boolean;
  category?: Category;
  categoryProperties?: CategoryProperties;
  filter: (category: Category) => Promise<void>;
  reset: () => Promise<void>;
};

export const CategoryFilterContext = createContext<CategoryFilterContextType>({
  isFilteringActive: false,
  filter: () => Promise.resolve(),
  reset: () => Promise.resolve(),
});

export function CategoryFilterContextProvider({
  children,
}: { children: ReactNode }) {
  const router = useAppStateAwareRouter();

  const category = router.query.category as Category;
  const categoryProperties = categories[category];
  const isFilteringActive = Boolean(categoryProperties);

  const filter = async (category: Category) => {
    await router.push({ pathname: "/", query: { category } });
  };
  const reset = async () => {
    await router.replace({ query: { category: "" } });
  };

  return (
    <CategoryFilterContext.Provider
      value={{
        isFilteringActive,
        category,
        categoryProperties,
        filter,
        reset,
      }}
    >
      {children}
    </CategoryFilterContext.Provider>
  );
}

export const useCategoryFilter = () => {
  return useContext(CategoryFilterContext);
};
