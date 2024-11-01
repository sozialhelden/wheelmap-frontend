import { FC } from 'react'
import { Layer, LayerProps } from 'react-map-gl'
import { filterForLayer, useMapFilterContext } from './filter'

/**
 * If there are no filters passed as argument, a filter expression will be built from the map filter context
 */
export const MapLayer: FC<LayerProps & { asFilterLayer: boolean }> = ({ asFilterLayer, ...props }) => {
  const { filter: mapFilters } = useMapFilterContext()

  if (asFilterLayer) {
    const builtFilters = filterForLayer(props.id, mapFilters)
    if (builtFilters) {
      return <Layer {...props} filter={builtFilters} />
    }
    return null
  }

  return (<Layer {...props} />)
}
