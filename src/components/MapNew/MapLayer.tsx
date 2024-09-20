import { FC } from 'react'
import { Layer, LayerProps } from 'react-map-gl'
import { filterForLayer, useMapFilter } from './useMapFilter'

/**
 * If there are no filters passed as argument, a filter expression will be built from the map filter context
 */
export const MapLayer: FC<LayerProps> = ({ filter, ...props }) => {
  const { filter: mapFilters } = useMapFilter()

  if (!filter || filter.length <= 0) {
    const builtFilters = filterForLayer(props.id, mapFilters)
    if (builtFilters) {
      return <Layer {...props} filter={builtFilters} />
    }
    return (<Layer {...props} />)
  }

  const builtFilters = filterForLayer(props.id, mapFilters)
  // @ts-ignore ts(2322) - type coercion fails because of subtypes:
  // - https://github.com/microsoft/TypeScript/issues/57013
  // - https://github.com/microsoft/TypeScript/issues/59716
  return <Layer {...props} filter={builtFilters ? ['all', builtFilters, filter] : filter} />
}
