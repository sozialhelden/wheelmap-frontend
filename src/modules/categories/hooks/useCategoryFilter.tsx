import {
  type Category,
  type CategoryBaseProperties,
  getCategories,
} from "@sozialhelden/core";
import { type ReactNode, createContext, useContext } from "react";

import { useAppState } from "~/modules/app-state/hooks/useAppState";
import { getCategoryFilterState } from "~/modules/categories/utils/state";

export type CategoryFilterContextType = {
  isFilteringActive: boolean;
  category?: Category | "";
  categoryProperties?: CategoryBaseProperties;
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
  const { appState, setAppState } = useAppState();

  const { category, categoryProperties, isFilteringActive } =
    getCategoryFilterState(appState);

  const filter = async (category: Category) => {
    setAppState({ category: category });
  };
  const reset = async () => {
    setAppState({ category: undefined });
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
