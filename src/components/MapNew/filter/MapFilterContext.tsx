import { createContext, FC, ReactNode } from 'react'
import { FilterContext, HighlightId } from './types'
import { useFilterContextState } from './useMapFilterContextValue'

export const MapFilterContext = createContext<FilterContext>({
  filter: {},
  addFilter: (filter) => ({ ...filter, id: (filter.id ?? crypto.randomUUID()) as HighlightId }),
  remove: () => { },
  removeById: () => { },
})

export const MapFilterContextProvider:FC<{ children?: ReactNode }> = ({ children }) => {
  const filterContextValue = useFilterContextState()
  return (<MapFilterContext.Provider value={filterContextValue}>{children}</MapFilterContext.Provider>)
}
