import React from "react";

export type FilterContextType = {
  filterMap: Map<string, boolean>;
  setFilterMap: React.Dispatch<React.SetStateAction<Map<string, boolean>>>;
  extent: string;
  setExtent: React.Dispatch<React.SetStateAction<string>>;
};

export const FilterContext = React.createContext<FilterContextType>({
  filterMap: new Map<string, boolean>(),
  setFilterMap: () => {},
  extent: "",
  setExtent: () => {},
});

export function getFilterLabels(fc: FilterContextType) {
  return Array.from(fc.filterMap.keys());
}

export function getFilterInputExtent(fc: FilterContextType) {
  return fc.extent;
}
