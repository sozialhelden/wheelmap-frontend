import React from "react";
import { FilterOptions } from "./helpers";

export type FilterContextType = {
  filterMap: Map<string, boolean>;
  setFilterMap: React.Dispatch<React.SetStateAction<Map<string, boolean>>>;
  filterOptions: FilterOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>;
  healthcareOptions: any[];
  setHealthcareOptions: React.Dispatch<React.SetStateAction<any[]>>;
  healthcareSpecialityOptions: any[];
  setHealthcareSpecialityOptions: React.Dispatch<React.SetStateAction<any[]>>;
};

export const FilterContext = React.createContext<FilterContextType>({
  filterMap: new Map<string, boolean>(),
  setFilterMap: () => {},
  filterOptions: {
    city: "",
    wheelchair: "",
    limit: "",
    healthcare: "",
    ["healthcare:speciality"]: "",
  },
  setFilterOptions: () => {},
  healthcareOptions: [],
  setHealthcareOptions: () => [],
  healthcareSpecialityOptions: [],
  setHealthcareSpecialityOptions: () => [],
});

export function getFilterLabels(fc: FilterContextType) {
  return Array.from(fc.filterMap.keys());
}

export function getFilterOptionsInput(fc: FilterContextType) {
  return fc.filterOptions;
}

export function getHealthcareOptionsInput(fc: FilterContextType) {
  return fc.healthcareOptions;
}

export function getHealthcareSpecialityOptionsInput(fc: FilterContextType) {
  return fc.healthcareSpecialityOptions;
}
