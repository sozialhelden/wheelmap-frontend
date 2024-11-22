import { useEffect } from 'react'
import { useMapFilterContext } from './useMapFilterContext'
import { HighlightId } from './types'
import { makeFilterByNode } from './filterOperators'
import { OSMId } from '../../../lib/typing/brands/osmIds'
import { AccessibilityCloudRDFId } from '../../../lib/typing/brands/accessibilityCloudIds'
import { getOSMRDFComponents, isOSMId } from '../../../lib/typing/discriminators/osmDiscriminator'

export const useMapHighlight = (featureId: OSMId | AccessibilityCloudRDFId) => {
  const { addFilter, removeById } = useMapFilterContext()

  useEffect(() => {
    const id = isOSMId(featureId) ? getOSMRDFComponents(featureId) : undefined
    let filterId: HighlightId | undefined
    if (id) {
      filterId = addFilter(makeFilterByNode(`${id.properties.element}/${id.properties.value}`)).id
    }

    return () => {
      if (filterId) {
        removeById(filterId)
      }
    }
  }, [featureId, addFilter, removeById])
}
