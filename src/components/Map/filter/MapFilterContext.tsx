import { type ReactNode, createContext } from "react";
import type { FilterContext, HighlightId } from "./types";
import { useCreateMapFilterContextState } from "./useCreateMapFilterContextState";

export const MapFilterContext = createContext<FilterContext>({
  filter: {},
  addFilter: (filter) => ({
    ...filter,
    id: (filter.id ?? crypto.randomUUID()) as HighlightId,
  }),
  remove: () => {},
  removeById: () => {},
  listeners: new Set(),
});

export const MapFilterContextProvider = ({
  children,
}: { children?: ReactNode }) => {
  const filterContextValue = useCreateMapFilterContextState();

  return (
    <MapFilterContext.Provider value={filterContextValue}>
      {children}
    </MapFilterContext.Provider>
  );
};
