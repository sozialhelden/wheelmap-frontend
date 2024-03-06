import React from "react";
import { FilterOptions, defaultFilterOptions } from "./helpers";

export type FilterContextType = {
  filterMap: Map<string, boolean>;
  setFilterMap: React.Dispatch<React.SetStateAction<Map<string, boolean>>>;
  filterOptions: FilterOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>;
};

export const FilterContext = React.createContext<FilterContextType>({
  filterMap: new Map<string, boolean>(),
  setFilterMap: () => {},
  filterOptions: {
    bbox: defaultFilterOptions.bbox,
    wheelchair: defaultFilterOptions.wheelchair,
    limit: defaultFilterOptions.limit,
    healthcare: defaultFilterOptions.healthcare,
    ["healthcare:speciality"]: defaultFilterOptions["healthcare:speciality"],
  },
  setFilterOptions: () => {},
});

export function getFilterLabels(fc: FilterContextType) {
  return Array.from(fc.filterMap.keys());
}

export function getFilterOptionsInput(fc: FilterContextType) {
  return fc.filterOptions;
}
