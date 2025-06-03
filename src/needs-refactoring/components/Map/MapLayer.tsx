import type { FC } from "react";
import { Layer, type LayerProps } from "react-map-gl/mapbox";
import { filterForLayer, useMapFilterContext } from "./filter";

/**
 * If there are no filters passed as argument, a filter expression will be built from the map filter context
 */
export const MapLayer: FC<LayerProps & { asFilterLayer?: boolean }> = ({
  asFilterLayer,
  ...props
}) => {
  const { filter: mapFilters } = useMapFilterContext();

  if (asFilterLayer) {
    const builtFilters = filterForLayer(props.id, mapFilters);
    if (!builtFilters) {
      return null;
    }
    const combinedFilters = [
      "all",
      filterForLayer(props.id, mapFilters),
      ...(props.filter?.[0] === "all" ? props.filter.slice(1) : [props.filter]),
    ].filter(Boolean);

    const data = {
      ...props,
      layout: { ...props.layout, visibility: "visible" },
    };

    return <Layer {...data} filter={combinedFilters} />;
  }

  return <Layer {...props} />;
};
