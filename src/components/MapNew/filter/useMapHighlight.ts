import { useEffect } from 'react'
import { AnyFeature } from '../../../lib/model/geo/AnyFeature'
import { useMapFilterContext } from './useMapFilterContext'
import { HighlightId } from './types'
import { makeFilterByNode } from './filterOperators'

export const useMapHighlight = (feature: AnyFeature | undefined) => {
  const { addFilter, removeById } = useMapFilterContext()

  useEffect(() => {
    const id = feature?._id
    let filterId: HighlightId | undefined
    if (id) {
      filterId = addFilter(makeFilterByNode(id)).id
    }

    return () => {
      if (filterId) {
        removeById(filterId)
      }
    }
  }, [feature, addFilter, removeById])
}
