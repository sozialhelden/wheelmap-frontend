import OSMFeature from '../model/osm/OSMFeature'

export async function fetchOneOSMFeature(
  baseUrl: string,
  prefixedId?: string,
): Promise<OSMFeature | undefined> {
  const [prefix, osmType, id] = prefixedId?.split(':') ?? []
  const url = `${baseUrl}/${prefix}/${osmType}/${id}.geojson`
  const r = await fetch(url)
  return await r.json()
}
