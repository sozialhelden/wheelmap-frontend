import {
  type Category,
  type CategoryBaseProperties,
  getCategories,
} from "@sozialhelden/core";
import { type ReactNode, createContext, useContext } from "react";

import { useAppState } from "~/modules/app-state/hooks/useAppState";

export type CategoryFilterContextType = {
  isFilteringActive: boolean;
  category?: Category;
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

  const category = appState.category;
  const categoryProperties = category ? getCategories()[category] : undefined;
  const isFilteringActive = Boolean(categoryProperties);

  const filter = async (category: Category) => {
    await setAppState({ category: category });
  };
  const reset = async () => {
    await setAppState({ category: undefined });
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
