import { Source, Layer, LayerProps } from 'react-map-gl'
import { useMemo } from 'react'
import { getAccessibilityCloudAPI } from '../../lib/fetchers/ac/useAccessibilityCloudAPI'
import { useEnvContext } from '../../lib/context/EnvContext'
import { useCurrentApp } from '../../lib/context/AppContext'
import { YesNoLimitedUnknown } from '../../lib/model/ac/Feature'

export default function MarkerBackgroundLayer({
  wheelchairTag, currentSelectedId, source, sourceLayer,
}: {
  wheelchairTag: YesNoLimitedUnknown,
  currentSelectedId?: string,
  source: string,
  sourceLayer: string,
}) {
  const layerProps = useMemo(() : LayerProps => ({
    id: `${source}-poi-a11y-${wheelchairTag}`,
    type: 'symbol',
    paint: {},
    source: 'features',
    layout: {
      'icon-size': [
        'interpolate',
        [
          'linear',
        ],
        [
          'zoom',
        ],
        6, ['case', ['==', ['get', '_id'], currentSelectedId || null], 3, 0.3],
        14, ['case', ['==', ['get', '_id'], currentSelectedId || null], 3, 0.5],
        16, ['case', ['==', ['get', '_id'], currentSelectedId || null], 3, 0.7],
        18, ['case', ['==', ['get', '_id'], currentSelectedId || null], 5, 3.2],
      ],
      'icon-image': `${wheelchairTag}WithoutArrow`,
      'icon-allow-overlap': true,
    },
    filter: [
      'all',
      ['==', ['get', 'wheelchair'], wheelchairTag],
    ],
  }), [source, wheelchairTag, currentSelectedId])

  return <Layer {...layerProps} source={source} source-layer={sourceLayer} />
}

export function MarkerIconLayer(
  { currentSelectedId, source, sourceLayer }: { currentSelectedId?: string, source: string, sourceLayer: string },
) {
  const staticProps = useMemo(() : LayerProps => ({
    id: `${source}-poi-symbols`,
    type: 'symbol',
    paint: {
      'text-color': 'hsl(230, 42%, 24%)',
      'text-halo-color': 'rgb(255, 255, 255)',
      'text-halo-width': 1,
    },
    // minzoom: 8,
    layout: {
      'icon-image': [
        'concat',
        [
          'to-string',
          [
            'get',
            'category',
          ],
        ],
        '-15-white',
      ],
      'text-field': [
        'to-string',
        [
          'get',
          'name',
        ],
      ],
      'text-font': [
        'Inter Regular',
        'Arial Unicode MS Regular',
      ],
      'text-size': [
        'interpolate',
        [
          'linear',
        ],
        [
          'zoom',
        ],
        0,
        12,
        22,
        15,
      ],
      'text-anchor': 'top',
      'text-offset': [
        0,
        1,
      ],
      'icon-optional': false,
      'icon-allow-overlap': true,
      'icon-size': [
        'interpolate',
        [
          'linear',
        ],
        [
          'zoom',
        ],
        0, ['case', ['==', ['get', '_id'], currentSelectedId || null], 2, 0],
        16, ['case', ['==', ['get', '_id'], currentSelectedId || null], 2, 0],
        17, ['case', ['==', ['get', '_id'], currentSelectedId || null], 2, 1],
        22, ['case', ['==', ['get', '_id'], currentSelectedId || null], 4, 2.5],
      ],
    },
  }), [source, currentSelectedId])

  return <Layer {...staticProps} source-layer={sourceLayer} source={source} />
}

export const AcPoiLayers = () => {
  const env = useEnvContext()
  const app = useCurrentApp()

  if (!app) {
    throw new Error('App not found')
  }

  const { tokenString, clientSideConfiguration } = app

  const { baseUrl: acBaseUrl, appToken: acAppToken } = getAccessibilityCloudAPI(env, tokenString, true)

  const tiles = useMemo(() => {
    const wheelmapSourceId = 'LiBTS67TjmBcXdEmX'
    const excludeSourceIds = clientSideConfiguration.excludeSourceIds || []
    excludeSourceIds.push(wheelmapSourceId)
    const includeSourceIds = clientSideConfiguration.includeSourceIds || []

    const urlParams = new URLSearchParams({
      includePlacesWithoutAccessibility: '1',
    })
    if (acAppToken) {
      urlParams.set('appToken', acAppToken)
    }
    if (excludeSourceIds.length > 0) {
      urlParams.set('excludeSourceIds', excludeSourceIds.join(','))
    }
    if (includeSourceIds.length > 0) {
      urlParams.set('includeSourceIds', includeSourceIds.join(','))
    }
    return [`${acBaseUrl}/place-infos.mvt?${urlParams.toString()}&x={x}&y={y}&z={z}`]
  }, [
    acBaseUrl,
    acAppToken,
    clientSideConfiguration,
  ])

  return (
    <>
      <Source type="vector" tiles={tiles} id="ac:PlaceInfo" scheme="xyz" minzoom={8} />
    </>
  )
}
