import React from "react";

export type FilterContextType = {
  filterMap: Map<string, boolean>;
  setFilterMap: React.Dispatch<React.SetStateAction<Map<string, boolean>>>;
}

export const FilterContext = React.createContext<FilterContextType>({
  filterMap: new Map<string, boolean>(),
  setFilterMap: () => {}
});


export function getFilterLabels(fc: FilterContextType) {
  return (Array.from(fc.filterMap.keys()));
}