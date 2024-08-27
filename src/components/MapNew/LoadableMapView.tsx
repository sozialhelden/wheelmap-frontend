import dynamic from 'next/dynamic'
import MapLoadingIndicator from './MapLoadingIndicator'

const LoadableMapView = dynamic(import('./MapView'), {
  ssr: false,
  loading: () => <MapLoadingIndicator />,
})

export default LoadableMapView
