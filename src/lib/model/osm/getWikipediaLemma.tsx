import OSMFeature from './OSMFeature'

export function getWikipediaLemma(feature: OSMFeature, prefix: string) {
  return feature.properties[prefix ? `${prefix}:wikipedia` : 'wikipedia'] || feature.properties[prefix ? `${prefix}:wikidata` : 'wikidata']
}