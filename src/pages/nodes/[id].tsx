import { useEffect } from 'react'
import { useAppStateAwareRouter } from '../../lib/util/useAppStateAwareRouter'

export default function LegacyNodeFeaturesPage() {
  const { replace, query: { id } } = useAppStateAwareRouter()

  useEffect(() => {
    const isOSMFeatureId = typeof id === 'string' && id.length > 0 && /^-?\d+$/.test(id)

    if (isOSMFeatureId) {
      if (id.startsWith('-')) {
        replace(`/way/${id}`)
      } else {
        replace(`/node/${id}`)
      }
    }

    replace(`/ac:PlaceInfo/${id}`)
  }, [replace, id])

  return null
}
