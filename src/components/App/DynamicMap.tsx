import dynamic from 'next/dynamic'
import MapLoadingIndicator from '../Map/MapLoadingIndicator'

const DynamicMap = dynamic(import('../Map/Map'), {
  ssr: false,
  loading: () => <MapLoadingIndicator />,
})

export default DynamicMap
