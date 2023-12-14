import React from "react";

export type FilterContextType = {
  filterMap: Map<string, boolean>;
  setFilterMap: React.Dispatch<React.SetStateAction<Map<string, boolean>>>;
  extent: [number, number, number, number];
  setExtent: React.Dispatch<React.SetStateAction<[number, number, number, number]>>;
}

export const FilterContext = React.createContext<FilterContextType>({
  filterMap: new Map<string, boolean>(),
  setFilterMap: () => {},
  extent: null,
  setExtent: () => {},
});


export function getFilterLabels(fc: FilterContextType) {
  return (Array.from(fc.filterMap.keys()));
}

export function getFilterInputExtent(fc: FilterContextType) {
  return fc.extent;
}