import React from "react";
import { FilterOptions } from "./helpers";

export type FilterContextType = {
  filterOptions: FilterOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>;
};

export const FilterContext = React.createContext<FilterContextType>({
  filterOptions: {},
  setFilterOptions: () => {},
});

export function useFilterOptionsUrlInput(fc: FilterContextType) {
  return fc.filterOptions;
}
