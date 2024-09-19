const collectionsByOsmKey = {
  way: ['amenities', 'buildings'],
  node: ['amenities', 'buildings'],
  relation: ['amenities', 'buildings'],
} as const

export function rolloutOsmFeatureIds(osmKey: 'way' | 'node' | 'relation', osmIds: string | string[]) {
  const idArray = Array.isArray(osmIds) ? osmIds : [osmIds]
  const collections = collectionsByOsmKey[osmKey] || ['amenities']

  return idArray.flatMap((osmId) => collections.map((collection) => `${collection}:${osmKey}:${osmId}`))
}
