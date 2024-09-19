import styled from 'styled-components'
import { useMultipleFeaturesOptional } from '../../lib/fetchers/fetchMultipleFeatures'
import { AnyFeature } from '../../lib/model/geo/AnyFeature'
import Toolbar from '../shared/Toolbar'
import { CombinedFeaturePanel } from './CombinedFeaturePanel'
import CloseLink from '../shared/CloseLink'
import { useAppStateAwareRouter } from '../../lib/util/useAppStateAwareRouter'
import Spinner from '../ActivityIndicator/Spinner'

const PositionedCloseLink = styled(CloseLink)`
  align-self: flex-start;
  margin-top: -8px;
  margin-right: 1px;
`
PositionedCloseLink.displayName = 'PositionedCloseLink'

export function MultiFeatureToolbar({ featureIds } : { featureIds: string | string[] }) {
  const { push } = useAppStateAwareRouter()
  const { data, isLoading, isValidating } = useMultipleFeaturesOptional(
    featureIds,
    {
      shouldRetryOnError: false,
    },
  )

  const filteredFeatures = data?.filter((f) => !!(f && f.status === 'fulfilled' && f.value))
    .map((f) => (f as PromiseFulfilledResult<AnyFeature>).value)

  const isBusy = isLoading || isValidating

  if (isBusy) {
    return <Spinner size={50} />
  }

  return (
    <Toolbar>
      <PositionedCloseLink onClick={() => push('/')} />
      <CombinedFeaturePanel features={filteredFeatures || []} />
    </Toolbar>
  )
}
