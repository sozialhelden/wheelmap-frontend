import { useEffect } from 'react'
import { useMapFilterContext } from './useMapFilterContext'
import { HighlightId } from './types'
import { makeFilterById } from './filterOperators'
import { OSMId } from '../../../lib/typing/brands/osmIds'
import { AccessibilityCloudRDFId } from '../../../lib/typing/brands/accessibilityCloudIds'
import { getOSMRDFComponents, isOSMId } from '../../../lib/typing/discriminators/osmDiscriminator'
import { isAccessibilityCloudId } from '../../../lib/typing/discriminators/isAccessibilityCloudId'

export const useMapHighlight = (featureId: OSMId | AccessibilityCloudRDFId) => {
  const { addFilter, removeById } = useMapFilterContext()

  useEffect(() => {
    let mapFeatureId: string | undefined

    if (isOSMId(featureId)) {
      const id = getOSMRDFComponents(featureId)
      if (id) {
        mapFeatureId = `${id.properties.element}/${id.properties.value}`
      }
    }

    if (isAccessibilityCloudId(featureId)) {
      mapFeatureId = featureId.split('/')?.[1]
    }

    const filterId: HighlightId | undefined = mapFeatureId ? addFilter(makeFilterById(mapFeatureId)).id : undefined

    return () => {
      if (filterId) {
        removeById(filterId)
      }
    }
  }, [featureId, addFilter, removeById])
}
