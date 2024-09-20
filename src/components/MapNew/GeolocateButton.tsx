import { createGlobalStyle } from 'styled-components'
import { GeolocateControl } from 'react-map-gl'
import { FC } from 'react'
import useUserAgent from '../../lib/context/UserAgentContext'
import LocateIcon from '../icons/actions/LocateOff.svg'
import LocateOnIcon from '../icons/actions/LocateOn.svg'
import LocateUnavailableIcon from '../icons/actions/LocateUnavailable.svg'

const MapboxLocationPinStyles = createGlobalStyle`
  .mapboxgl-ctrl > button.mapboxgl-ctrl-geolocate.mapboxgl-ctrl-geolocate-active > .mapboxgl-ctrl-icon {
    background-image: url(${LocateOnIcon.src});
    background-size: 65%;
    background-position: center center;
  }

  .mapboxgl-ctrl > button.mapboxgl-ctrl-geolocate > .mapboxgl-ctrl-icon {
    background-image: url(${LocateIcon.src});
    background-size: 65%;
    background-position: center center;
  }

  .mapboxgl-ctrl > button.mapboxgl-ctrl-geolocate:disabled > .mapboxgl-ctrl-icon {
    background-image: url(${LocateUnavailableIcon.src});
    background-size: 65%;
    background-position: center center;
  }

  .mapboxgl-ctrl button.mapboxgl-ctrl-geolocate.mapboxgl-ctrl-geolocate-waiting .mapboxgl-ctrl-icon {
    animation: 1.5s crossfade ease infinite;

    @keyframes crossfade {
      0% {
        opacity: 0.2;
      }

      50% {
        opacity: 1;
      }
      
      100% {
        opacity: 0.2;
      }
    }
  }
`

export const GeolocateButton: FC = () => {
  const userAgent = useUserAgent()
  const isAndroid = userAgent?.os?.name === 'Android'
  return (
    <>
      { !isAndroid && <MapboxLocationPinStyles />}
      <GeolocateControl
        positionOptions={{ enableHighAccuracy: true }}
        trackUserLocation
      />
    </>
  )
}
