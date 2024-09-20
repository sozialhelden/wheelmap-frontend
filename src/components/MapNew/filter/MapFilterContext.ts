import { createContext } from 'react'
import { FilterContext, HighlightId } from './types'

export const MapFilterContext = createContext<FilterContext>({
  filter: {},
  addFilter: (filter) => ({ ...filter, id: (filter.id ?? crypto.randomUUID()) as HighlightId }),
  remove: () => { },
  removeById: () => { },
})
