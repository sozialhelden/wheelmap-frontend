import {
  createContext, ReactNode,
} from 'react'
import { FilterContext, HighlightId } from './types'
import { useCreateMapFilterContextState } from './useCreateMapFilterContextState'

export const MapFilterContext = createContext<FilterContext>({
  filter: {},
  addFilter: (filter) => ({ ...filter, id: (filter.id ?? crypto.randomUUID()) as HighlightId }),
  remove: () => { },
  removeById: () => { },
})

export const MapFilterContextProvider = ({ children }: { children?: ReactNode }) => {
  const filterContextValue = useCreateMapFilterContextState()

  return (<MapFilterContext.Provider value={filterContextValue}>{children}</MapFilterContext.Provider>)
}
