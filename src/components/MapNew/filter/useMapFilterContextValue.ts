import { useCallback, useMemo, useState } from 'react'
import { Filter, HighlightId, FilterContext } from './types'
import { log } from '../../../lib/util/logger'

export const useFilterContextState = (): FilterContext => {
  const [state, setState] = useState<Partial<Record<HighlightId, Filter>>>({})
  const addFilter = useCallback((filter) => {
    const entryId = (filter.id ?? crypto.randomUUID()) as HighlightId
    const entry = { ...filter, id: entryId }

    setState((prev) => {
      if (prev[entryId] !== undefined) {
        log.warn(`Cannot add filter with the same id of ${entryId}`)
        return prev
      }

      return ({ ...prev, [entryId]: entry })
    })
    return entry
  }, [])

  const remove = useCallback((filter) => {
    setState((prev) => {
      const { id } = filter
      const replacement = {} as Partial<Record<HighlightId, Filter>>
      const entries = Object.entries(prev)
      for (let i = 0; i < entries.length; i += 1) {
        const [key, value] = entries[i]
        if (value && value.id !== id) {
          replacement[key] = value
        }
      }

      return replacement
    })
  }, [])

  const removeById = useCallback((id) => {
    setState((prev) => {
      const replacement = {} as Partial<Record<HighlightId, Filter>>
      const entries = Object.entries(prev)

      for (let i = 0; i < entries.length; i += 1) {
        const [key, value] = entries[i]
        if (key === id) {
          // b...please.
          // eslint-disable-next-line no-continue
          continue
        }
        replacement[key] = value
      }
      return replacement
    })
  }, [])

  return useMemo(() => ({
    filter: state,
    addFilter,
    remove,
    removeById,
  }), [state, addFilter, remove, removeById])
}
