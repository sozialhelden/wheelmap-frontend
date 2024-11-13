import * as React from 'react'
import { useEffect, useState } from 'react'
import { t } from 'ttag'
import { useHotkeys } from '@blueprintjs/core'
import { LayerProps } from 'react-map-gl'
import useMapStyle from './useMapStyle'
import { filterLayers } from './filterLayers'
import { MapLayer } from './MapLayer'

export const MapLayers = ({ onInteractiveLayersChange } : { onInteractiveLayersChange: (layerIds: string[]) => void }) => {
  const mapStyle = useMapStyle()

  const [hasBuildings, setHasBuildings] = useState(true)
  const [hasPublicTransport, setHasPublicTransport] = useState(false)
  const [hasSurfaces, setHasSurfaces] = useState(true)

  const hotkeys = React.useMemo(() => [
    {
      combo: '1',
      global: true,
      label: t`Toggle building focus`,
      onKeyDown: () => setHasBuildings(!hasBuildings),
    },
    {
      combo: '2',
      global: true,
      label: t`Toggle public transport focus`,
      onKeyDown: () => setHasPublicTransport(!hasPublicTransport),
    },
    {
      combo: '3',
      global: true,
      label: t`Toggle surfaces`,
      onKeyDown: () => setHasSurfaces(!hasSurfaces),
    },
  ], [hasBuildings, hasPublicTransport, hasSurfaces])
  useHotkeys(hotkeys)

  const [layers, highlightLayers] = React.useMemo(
    () => {
      if (mapStyle.data?.layers) {
        return filterLayers({
          layers: mapStyle.data.layers, hasBuildings, hasPublicTransport, hasSurfaces,
        })
      }
      return [[], []]
    },
    [mapStyle.data?.layers, hasBuildings, hasPublicTransport, hasSurfaces],
  )

  useEffect(() => {
    const layerIds = layers.map((layer) => layer.id)
    onInteractiveLayersChange(layerIds)
  }, [onInteractiveLayersChange, layers])

  return (
    <>
      {layers?.map((layer) => <MapLayer key={layer.id} {...(layer as LayerProps)} />)}
      {highlightLayers?.map((layer) => <MapLayer key={layer.id} {...(layer as LayerProps)} asFilterLayer />)}
    </>
  )
}
