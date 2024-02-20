import React from "react";

export type FilterContextType = {
  filterMap: Map<string, boolean>;
  setFilterMap: React.Dispatch<React.SetStateAction<Map<string, boolean>>>;
  city: string;
  setCity: React.Dispatch<React.SetStateAction<string>>;
  wheelchair: string;
  setWheelchair: React.Dispatch<React.SetStateAction<string>>;
};

export const FilterContext = React.createContext<FilterContextType>({
  filterMap: new Map<string, boolean>(),
  setFilterMap: () => {},
  city: "",
  setCity: () => {},
  wheelchair: "",
  setWheelchair: () => {},
});

export function getFilterLabels(fc: FilterContextType) {
  return Array.from(fc.filterMap.keys());
}

export function getFilterInputCity(fc: FilterContextType) {
  return fc.city;
}

export function getFilterInputWheelchair(fc: FilterContextType) {
  return fc.wheelchair;
}
