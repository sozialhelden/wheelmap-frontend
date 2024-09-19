import { ReactElement } from 'react'
import MapLayout from '../../components/App/MapLayout'
import { useAppStateAwareRouter } from '../../lib/util/useAppStateAwareRouter'
import { rolloutOsmFeatureIds } from '../../lib/model/osm/rolloutOsmFeatureIds'
import { MultiFeatureToolbar } from '../../components/CombinedFeaturePanel/MultiFeatureToolbar'

export default function NodeFeaturePage() {
  const { query: { id } } = useAppStateAwareRouter()

  const rolledOutIds = rolloutOsmFeatureIds('node', id)

  return (
    <MultiFeatureToolbar featureIds={rolledOutIds} />
  )
}

NodeFeaturePage.getLayout = function getLayout(page: ReactElement) {
  return <MapLayout>{page}</MapLayout>
}
