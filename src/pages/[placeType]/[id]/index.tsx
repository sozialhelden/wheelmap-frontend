import { ReactElement } from 'react'
import MapLayout from '../../../components/App/MapLayout'
import { MultiFeatureToolbar } from '../../../components/CombinedFeaturePanel/MultiFeatureToolbar'
import { useAppStateAwareRouter } from '../../../lib/util/useAppStateAwareRouter'
import { rolloutOsmFeatureIds } from '../../../lib/model/osm/rolloutOsmFeatureIds'

const allowedPlaceTypes = [
  'composite',
  'node', 'way', 'relation',
  'entrances_or_exits', 'buildings', 'amenities',
  'ac:PlaceInfo', 'ac:EquipmentInfo',
] as const

function buildFeatureIds(placeType: string, ids: string[]) {
  console.log('placeType', placeType, ids)

  if (!allowedPlaceTypes.includes(placeType as any)) {
    throw new Error(`Invalid or unknown placeType: ${placeType}`)
  }

  if (placeType === 'composite') {
    return ids
  }

  if (placeType === 'way' || placeType === 'relation' || placeType === 'node') {
    return rolloutOsmFeatureIds(placeType, ids)
  }

  return ids.map((id) => `${placeType}:${id}`)
}

export default function PlaceFeaturePage() {
  const { query: { placeType, id: idOrIds } } = useAppStateAwareRouter()

  const ids = Array.isArray(idOrIds) ? idOrIds : idOrIds?.split(',') || []
  const featureIds = buildFeatureIds(String(placeType), ids)

  return (
    <MultiFeatureToolbar featureIds={featureIds} />
  )
}

PlaceFeaturePage.getLayout = function getLayout(page: ReactElement) {
  return <MapLayout>{page}</MapLayout>
}
