import { FeatureCollection } from 'geojson'
import { t } from 'ttag'

const url = 'https://osm-api.wheelmap.tech/api/v1/admin_gen0.json?bbox=-180,-90,180,90&geometry=centroid&limit=10000&t[cc2]=*'

export default async function fetchCountryGeometry() {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(t`Could not load country geometry.`)
  }

  return response.json() as unknown as FeatureCollection
}
