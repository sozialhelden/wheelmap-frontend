import { useContext, useEffect, useState } from 'react'
import { MapFilterContext } from './MapFilterContext'
import { FilterContext } from './types'

export const useMapFilterContext = () => {
  const context = useContext(MapFilterContext)
  const [filter, setFilter] = useState<FilterContext['filter']>(context.filter)

  useEffect(() => {
    const listener = () => {
      setFilter(context.filter)
    }
    context.listeners.add(listener)
    return () => {
      context.listeners.delete(listener)
    }
  }, [context])

  return {
    ...context,
    filter,
  }
}
