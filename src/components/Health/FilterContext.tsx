import React from "react";
import { FilterOptions, defaultFilterOptions } from "./helpers";

export type FilterContextType = {
  filterOptions: FilterOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>;
};

export const FilterContext = React.createContext<FilterContextType>({
  filterOptions: {
    bbox: defaultFilterOptions.bbox,
    city: defaultFilterOptions.city,
    wheelchair: defaultFilterOptions.wheelchair,
    healthcare: defaultFilterOptions.healthcare,
    sort: defaultFilterOptions.sort,
    name: defaultFilterOptions.name,
  },
  setFilterOptions: () => {},
});

export function useFilterOptionsUrlInput(fc: FilterContextType) {
  return fc.filterOptions;
}
