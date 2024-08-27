import OSMFeature from '../../../lib/model/osm/OSMFeature'

export function getWikipediaLemma(feature: OSMFeature, prefix: string) {
  return feature.properties[prefix ? `${prefix}:wikipedia` : 'wikipedia']
}
