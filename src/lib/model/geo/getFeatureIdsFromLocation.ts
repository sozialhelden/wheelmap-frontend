import { uniq } from 'lodash'
import { OSMFeatureId } from '../osm/OSMFeature'

export default function useFeatureIdsFromLocation(pathname: string) {
  const match = pathname.match(/^\/(\w+)\/([\w,:-]+)/)
  let featureIds: OSMFeatureId[] = []
  if (match && typeof match[1] === 'string' && typeof match[2] === 'string') {
    const featureIdString = match[2]
    if (match[1] === 'composite') {
      const components = uniq(featureIdString.split(',').sort())
      featureIds = components.map((s) => {
        const [source, id] = s.split(':')
        return { source, id }
      })
    } else {
      featureIds = [{ source: match[1], id: featureIdString }]
    }
  }
  return featureIds
}
