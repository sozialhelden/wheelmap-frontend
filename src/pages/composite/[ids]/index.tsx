import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import styled from 'styled-components'
import Layout from '../../../components/App/Layout'
import { CombinedFeaturePanel } from '../../../components/CombinedFeaturePanel/CombinedFeaturePanel'
import CloseLink from '../../../components/shared/CloseLink'
import Toolbar from '../../../components/shared/Toolbar'
import { useMultipleFeatures } from '../../../lib/fetchers/fetchMultipleFeatures'
import Spinner from '../../../components/ActivityIndicator/Spinner'

const PositionedCloseLink = styled(CloseLink)`
  align-self: flex-start;
  margin-top: -8px;
  margin-right: 1px;
`
PositionedCloseLink.displayName = 'PositionedCloseLink'

export default function CompositeFeaturesPage() {
  const router = useRouter()
  const { ids } = router.query
  const { data, error, isValidating } = useMultipleFeatures(ids)

  if (!data && isValidating) {
    return <Spinner size={50} />
  }

  if (data) {
    return (
      <Toolbar>
        <CombinedFeaturePanel features={data || []} />
      </Toolbar>
    )
  }

  return null
}

CompositeFeaturesPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
