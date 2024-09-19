import { ReactElement } from 'react'
import MapLayout from '../../../components/App/MapLayout'
import { MultiFeatureToolbar } from '../../../components/CombinedFeaturePanel/MultiFeatureToolbar'
import { useAppStateAwareRouter } from '../../../lib/util/useAppStateAwareRouter'

export default function PlaceFeaturePage() {
  const { query: { placeType, id } } = useAppStateAwareRouter()

  return (
    <MultiFeatureToolbar featureIds={`${placeType}:${id}`} />
  )
}

PlaceFeaturePage.getLayout = function getLayout(page: ReactElement) {
  return <MapLayout>{page}</MapLayout>
}
